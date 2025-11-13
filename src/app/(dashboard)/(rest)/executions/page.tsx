import { credentialsParamsLoader } from '@/app/features/credentials/server/params-loader';
import { prefetchCredentials } from '@/app/features/credentials/server/prefetch';
import {
  ExecutionsContainer,
  ExecutionsError,
  ExecutionsList,
  ExecutionsLoading,
} from '@/app/features/executions/components/executions';
import { executionsParamsLoader } from '@/app/features/executions/server/params-loader';
import { prefetchExecutions } from '@/app/features/executions/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);

  prefetchExecutions(params);

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  );
};

export default Page;
