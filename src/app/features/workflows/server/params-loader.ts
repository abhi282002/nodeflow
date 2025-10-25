import { createLoader } from 'nuqs/server';
import { useWorkflowParams } from '../hooks/use-workflow-params';
import { workflowsParams } from '../params';

export const workflowParamsLoader = createLoader(workflowsParams);
