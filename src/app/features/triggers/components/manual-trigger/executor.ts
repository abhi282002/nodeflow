import type { NodeExecutor } from '@/app/features/executions/types';
import { manualTriggerChannel } from '@/inngest/inngest/manual-trigger';

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  //TODO:publish loading state

  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  const result = await step.run('manual_trigger', async () => context);

  await publish(
    manualTriggerChannel().status({
      nodeId,
      status: 'success',
    }),
  );

  //TODO Success state for manual triger
  return result;
};
