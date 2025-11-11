import { InitialNode } from '@/components/initial-node';
import { HttpRequestNode } from '@/app/features/executions/components/http-request/node';
import { NodeType } from '@/generated/prisma';
import type { NodeTypes } from '@xyflow/react';
import { ManualTriggerNode } from '@/app/features/triggers/components/manual-trigger/node';
import { GoogleFormTrigger } from '@/app/features/triggers/components/google-form-trigger/node';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
