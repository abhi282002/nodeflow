import { credentialsRouter } from '@/app/features/credentials/server/routers';
import { createTRPCRouter } from '../init';

import { workflowsRouter } from '@/app/features/workflows/server/routers';
import { executionRouter } from '@/app/features/executions/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionRouter,
});

export type AppRouter = typeof appRouter;
