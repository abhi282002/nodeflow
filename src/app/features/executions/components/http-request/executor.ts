import Handlebars from 'handlebars';
import type { NodeExecutor } from '@/app/features/executions/types';
import { NonRetriableError } from 'inngest';
import axios, { AxiosRequestConfig } from 'axios';
import { httpRequestChannel } from '@/inngest/inngest/http-request';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  //TODO:publish loading state

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  console.log(data.endpoint);

  if (!data.endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  }

  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError(
      'HTTP Request node: No variable name configured',
    );
  }

  try {
    const results = await step.run('http-request', async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);

      const method = data.method || 'GET';

      const options: AxiosRequestConfig = { method };
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        if (data.body) {
          const resolved = Handlebars.compile(data.body)(context);
          JSON.parse(resolved);
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

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: 'success',
      }),
    );

    return results;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw error;
  }
};
