import Handlebars from 'handlebars';
import type { NodeExecutor } from '@/app/features/executions/types';
import { NonRetriableError } from 'inngest';
import { decode } from 'html-entities';
import { discordChannel } from '@/inngest/channels/discord';
import axios from 'axios';
Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,

  context,
  step,
  publish,
}) => {
  //TODO:publish loading state

  await publish(
    discordChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Discord Node : Variable name is required');
  }

  if (!data.webhookUrl) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Discord Node : Webhook URL is required');
  }

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError('Discord Node : Content is required');
  }

  const rawContent = Handlebars.compile(data.content)(context);

  const content = decode(rawContent);

  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run('discord-webhook', async () => {
      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: 'error',
          }),
        );

        throw new NonRetriableError('Discord Node : Variable name is required');
      }

      await axios.post(data.webhookUrl!, {
        content,
        username,
      });

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: 'success',
      }),
    );
    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw error;
  }
};
