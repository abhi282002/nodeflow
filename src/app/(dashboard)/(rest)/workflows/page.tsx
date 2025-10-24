import {Suspense} from "react";


import {requireAuth} from "@/lib/auth-utils";
import {prefetchWorkflows} from "@/app/features/workflows/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {WorkflowContainer, WorkflowsList} from "@/app/features/workflows/components/workflow";

import {ErrorBoundary} from "react-error-boundary";

const Page = async () => {
    await requireAuth()

    prefetchWorkflows()

    return (
        <WorkflowContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <Suspense fallback={<p>Loading....</p>}>
                        <WorkflowsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowContainer>
    )
}

export default Page