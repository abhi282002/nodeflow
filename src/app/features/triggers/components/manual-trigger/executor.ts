import type { NodeExecutor } from '@/app/features/executions/types';

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  //TODO:publish loading state

  const result = await step.run('manual_trigger', async () => context);

  //TODO Success state for manual triger
  return result;
};
