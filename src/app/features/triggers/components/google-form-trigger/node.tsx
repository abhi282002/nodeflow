import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { MousePointerIcon } from 'lucide-react';
import { GoogleFormTriggerDialog } from './dialog';
import { useNodeStatus } from '@/app/features/executions/hooks/use-node-status';
import { MANUAL_TRIGGER_CHANNEL_NAME } from '@/inngest/inngest/channels/manual-trigger';
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/inngest/inngest/channels/google-form-trigger';
import { fetchGoogleFormTriggerRealtimeToken } from './actions';

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        status={nodeStatus}
        description="Google From"
        name="When form is submitted"
        onSettings={handleOpenSettings}
      />
    </>
  );
});
