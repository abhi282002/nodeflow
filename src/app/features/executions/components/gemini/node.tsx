'use client';

import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { AVAILABLE_MODELS, GeminiDialog, GeminiFormValues } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchGeminiRealtimeToken } from './actions';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini';


type GeminiNodeData = {
  variableName?: string;
  credentialId?: string;
  model?:
    | 'gemini-1.5-flash'
    | 'gemini-1.5-flash-8b'
    | 'gemini-1.5-pro'
    | 'gemini-1.0-pro'
    | 'gemini-pro'
    | undefined;
  systemPrompt?: string;
  userPrompt?: string;
};


type GeminiNodeType = Node<GeminiNodeData>;



export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as GeminiNodeData;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]} : ${nodeData.userPrompt.slice(
        0,
        50,
      )}...`
    : 'Not Configured';

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleSubmit = (values: GeminiFormValues) => {
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
      <GeminiDialog
        defaultValues={nodeData}
        onSubmit={handleSubmit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        status={nodeStatus}
        icon={'/logos/gemini.svg'}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GeminiNode.displayName = 'GeminiNode';
