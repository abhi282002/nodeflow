'use client';

import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { SlackDialog, SlackFormValue } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchSlackRealtimeToken } from './actions';
import { SLACK_CHANNEL_NAME } from '@/inngest/channels/slack';

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as SlackNodeData;
  const description = nodeData?.content
    ? `Send : ${nodeData.content.slice(0, 50)}...`
    : 'Not Configured';

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchSlackRealtimeToken,
  });

  const handleSubmit = (values: SlackFormValue) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <SlackDialog
        defaultValues={nodeData}
        onSubmit={handleSubmit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        status={nodeStatus}
        icon={'/logos/slack.svg'}
        name="Slack"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = 'Slack Node';
