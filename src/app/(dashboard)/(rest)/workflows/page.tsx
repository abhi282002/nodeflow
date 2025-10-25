import {
  WorkflowContainer,
  WorkflowList,
  WorkflowsError,
  WorkflowsLoading,
} from '@/app/features/workflows/components/workflow';
import { workflowParamsLoader } from '@/app/features/workflows/server/params-loader';
import { prefetchWorkflows } from '@/app/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  searchParams: Promise<{
    searchParams: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const params = await workflowParamsLoader(searchParams);

  await requireAuth();

  prefetchWorkflows(params);

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
};

export default Page;
