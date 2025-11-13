'use client';

import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { DiscordDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchDiscordRealtimeToken } from './actions';
import { DISCORD_CHANNEL_NAME } from '@/inngest/channels/discord';
import { DiscordFormValues } from './dialog';

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as DiscordNodeData;
  const description = nodeData?.content
    ? `Send : ${nodeData.content.slice(0, 50)}...`
    : 'Not Configured';

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
        defaultValues={nodeData}
        onSubmit={handleSubmit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        status={nodeStatus}
        icon={'/logos/discord.svg'}
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = 'Discord Node';
