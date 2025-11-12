import type { NodeExecutor } from '@/app/features/executions/types';
import { googleFormTriggerChannel } from '@/inngest/channels/google-form-trigger';
import { stripeTriggerChannel } from '@/inngest/channels/stripe-trigger';

type stripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<stripeTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  //TODO:publish loading state

  await publish(
    stripeTriggerChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  const result = await step.run('stripe_trigger', async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: 'success',
    }),
  );

  //TODO Success state for manual triger
  return result;
};
