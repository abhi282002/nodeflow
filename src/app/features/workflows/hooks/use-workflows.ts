import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useWorkflowParams } from './use-workflow-params';

/**Hook to get all workflows**/
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  const [params] = useWorkflowParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/****Hook to get single workflow***/

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.workflows.getOne.queryOptions({
      id,
    }),
  );
};

//Hook to create a new workflow

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully.`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error('Error creating workflow');
      },
    }),
  );
};

/***Update Workflow name***/

export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} updated successfully.`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({
            id: data.id,
          }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update worflow: ${error.message}`);
      },
    }),
  );
};

/***
 *
 * Hook to remove a workflow
 *
 */

export const useRemoveWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} removed successfully.`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({
            id: data.id,
          }),
        );
      },
    }),
  );
};
