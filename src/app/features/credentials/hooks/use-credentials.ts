import { useTRPC } from '@/trpc/client';
import { useCredentialsParams } from './use-credentials-params';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { CredentialType } from '@/generated/prisma';

/**Hook to get all credentials using suspense **/
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();

  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/****Hook to fetch a single credentials using suspense***/

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({
      id,
    }),
  );
};

//Hook to create a new credentials

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials ${data.name} created successfully.`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error('Error creating credentials');
      },
    }),
  );
};

/***Hook to update a credentials***/

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials ${data.name} saved.`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({
            id: data.id,
          }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save Credentials: ${error.message}`);
      },
    }),
  );
};

/***
 *
 * Hook to remove a credentials
 *
 */

export const useRemoveCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials ${data.name} removed successfully.`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({
            id: data.id,
          }),
        );
      },
    }),
  );
};

export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
