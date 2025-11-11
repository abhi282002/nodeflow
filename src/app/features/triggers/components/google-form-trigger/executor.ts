import type { NodeExecutor } from '@/app/features/executions/types';
import { googleFormTriggerChannel } from '@/inngest/inngest/google-form-trigger';

type googleFormTriggerData = Record<string, unknown>;

export const googleFomrTriggerExecutor: NodeExecutor<
  googleFormTriggerData
> = async ({ nodeId, context, step, publish }) => {
  //TODO:publish loading state

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  const result = await step.run('google_form_trigger', async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: 'success',
    }),
  );

  //TODO Success state for manual triger
  return result;
};
