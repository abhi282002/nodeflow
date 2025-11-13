import Handlebars from 'handlebars';
import type { NodeExecutor } from '@/app/features/executions/types';
import { NonRetriableError } from 'inngest';
import { decode } from 'html-entities';
import { slackChannel } from '@/inngest/channels/slack';
import axios from 'axios';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,

  context,
  step,
  publish,
}) => {
  //TODO:publish loading state

  await publish(
    slackChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) {
    await publish(
      slackChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Slack Node : Variable name is required');
  }

  if (!data.webhookUrl) {
    await publish(
      slackChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Slack Node : Webhook URL is required');
  }

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Slack Node : Content is required');
  }

  const rawContent = Handlebars.compile(data.content)(context);

  const content = decode(rawContent);

  try {
    const result = await step.run('slack-webhook', async () => {
      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: 'error',
          }),
        );

        throw new NonRetriableError('Slack Node : Variable name is required');
      }

      await axios.post(data.webhookUrl!, {
        content: content,
      });

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: 'success',
      }),
    );
    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw error;
  }
};
