import { NodeType } from '@/generated/prisma';
import { NodeExecutor } from '../../types';
import { manualTriggerExecutor } from '@/app/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../http-request/executor';
import { googleFomrTriggerExecutor } from '@/app/features/triggers/components/google-form-trigger/executor';
import { stripeTriggerExecutor } from '@/app/features/triggers/components/stripe-trigger/executor';
import { geminiExecutor } from '../gemini/executor';
import { discordExecutor } from '../discord/executor';
import { slackExecutor } from '../slack/executor';

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFomrTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.DISCORD]: discordExecutor,  
  [NodeType.SLACK]: slackExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type:${type}`);
  }
  return executor;
};
