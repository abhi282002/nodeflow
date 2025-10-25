'use client';

import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from '@/app/features/workflows/hooks/use-workflows';
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from '@/components/entity-views';
import { useUpgradeModel } from '@/hooks/use-upgrade-model';
import { useRouter } from 'next/navigation';
import { useWorkflowParams } from '../hooks/use-workflow-params';
import { useEntitySearch } from '@/hooks/use-entity-search';

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      placeholder="Search workflows"
      onChange={onSearchChange}
      value={searchValue}
    />
  );
};

export const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowParams();

  return (
    <EntityPagination
      disabled={!workflows.isFetched}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) =>
        setParams({
          ...params,
          page,
        })
      }
    />
  );
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return <p className="flex-1">{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  const createWorkflow = useCreateWorkflow();

  const { handleError, modal } = useUpgradeModel();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title={'Workflows'}
        description={'Create and manage your workflows'}
        onNew={handleCreate}
        newButtonLabel={'New Workflow'}
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
