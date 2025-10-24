"use client"

import {useCreateWorkflow, useSuspenseWorkflows} from "@/app/features/workflows/hooks/use-workflows";
import {EntityContainer, EntityHeader} from "@/components/entity-views";
import {useUpgradeModel} from "@/hooks/use-upgrade-model";
import {useRouter} from "next/navigation";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()

    return (
        <p>
            {JSON.stringify(workflows.data, null, 2)}
        </p>
    )
}


export const WorkflowHeader = ({disabled}: { disabled?: boolean }) => {
    const router = useRouter()
    
    const createWorkflow = useCreateWorkflow()

    const {handleError, modal} = useUpgradeModel()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }
    return (
        <>
            {modal}
            <EntityHeader title={"Workflows"} description={"Create and manage your workflows"} onNew={handleCreate}
                          newButtonLabel={"New Workflow"} disabled={disabled} isCreating={createWorkflow.isPending}/>
        </>
    )
}


export const WorkflowContainer = ({children}: { children: React.ReactNode }) => {

    return (
        <EntityContainer header={<WorkflowHeader/>} search={<></>} pagination={<></>}>{children}</EntityContainer>
    )
}
