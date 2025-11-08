'use client';

import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import { GlobeIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { HttpRequestFormValues, HttpRequestDialog } from './dialog';

type HttpRequestNodeData = {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endpoint
    ? `${nodeData.method || 'GET'}:${nodeData.endpoint}`
    : 'Not configured';

  const nodeStatus = 'initial';

  const handleSubmit = (values: HttpRequestFormValues) => {
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
      <HttpRequestDialog
        defaultValues={nodeData}
        onSubmit={handleSubmit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        status={nodeStatus}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = 'HttpRequestNode';
