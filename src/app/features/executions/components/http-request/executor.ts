import type { NodeExecutor } from '@/app/features/executions/types';
import { NonRetriableError } from 'inngest';
import axios, { AxiosRequestConfig } from 'axios';

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  //TODO:publish loading state
  if (!data.endpoint) {
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  }

  if (!data.variableName) {
    throw new NonRetriableError(
      'HTTP Request node: No variable name configured',
    );
  }

  const results = await step.run('http-request', async () => {
    const endpoint = data.endpoint;
    const method = data.method || 'GET';

    const options: AxiosRequestConfig = { method };
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body) {
        options.data = data.body;
        options.headers = {
          'Content-Type': 'application/json',
        };
      }
    }

    const response = await axios.request({
      url: endpoint,
      ...options,
    });




    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      },
    };

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }
    
    return {
      ...context,
      ...responsePayload,
    };
  });

  return results;
};
