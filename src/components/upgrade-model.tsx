"use client"


import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";


import {authClient} from "@/lib/auth-client";

interface UpgradeModelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function UpgradeModel({open, onOpenChange}: UpgradeModelProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                    <AlertDialogDescription>
                        You need an active subscription to perform this action. Upgrade to Pro to unlock all featers
                    </AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => authClient.checkout({
                        slug: "nodebase pro"
                    })}>
                        Upgrade Now
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}