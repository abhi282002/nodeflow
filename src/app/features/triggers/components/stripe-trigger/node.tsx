import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { useNodeStatus } from '@/app/features/executions/hooks/use-node-status';

import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/google-form-trigger';
import { fetchStripeTriggerRealtimeToken } from './actions';
import { StripeTriggerDialog } from './dialog';
import { STRIPE_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/stripe-trigger';

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/stripe.svg"
        status={nodeStatus}
        description="When Stripe Even is Captured"
        name="Stripe"
        onSettings={handleOpenSettings}
      />
    </>
  );
});
