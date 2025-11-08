import type { NodeExecutor } from '@/app/features/executions/types';
import { NonRetriableError } from 'inngest';
import axios, { AxiosRequestConfig } from 'axios';

type HttpRequestData = {
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

  const results = await step.run('http-request', async () => {
    const endpoint = data.endpoint;
    const method = data.method || 'GET';

    const options: AxiosRequestConfig = { method };
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (data.body) {
        options.data = data.body;
      }
    }

    const response = await axios.request({
      url: endpoint,
      ...options,
    });

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      },
    };
  });

  return results;
};
