
"use client"
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {requireUnAuth} from "@/lib/auth-utils";
import {toast} from "sonner";

const Page =  () => {

    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const {data} = useQuery(trpc.getWorkflows.queryOptions())

    const create = useMutation(trpc.createWorkflows.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
        }
    }))

    const testAi = useMutation(trpc.testAi.mutationOptions({
        onSuccess: () => {
            toast.success("Job queue successfully")
        }
    }))

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
       <Button disabled={testAi.isPending} onClick={()=>testAi.mutate()}>Test Ai</Button>
    </div>
  );
};

export default Page;
