import { InitialNode } from '@/components/initial-node';
import { HttpRequestNode } from '@/app/features/executions/components/http-request/node';
import { NodeType } from '@/generated/prisma';
import type { NodeTypes } from '@xyflow/react';
import { ManualTriggerNode } from '@/app/features/triggers/components/manual-trigger/node';
import { GoogleFormTrigger } from '@/app/features/triggers/components/google-form-trigger/node';
import { StripeTriggerNode } from '@/app/features/triggers/components/stripe-trigger/node';
import { GeminiNode } from '@/app/features/executions/components/gemini/node';
import { DiscordNode } from '@/app/features/executions/components/discord/node';
import { SlackNode } from '@/app/features/executions/components/slack/node';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.DISCORD]: DiscordNode,
  [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
