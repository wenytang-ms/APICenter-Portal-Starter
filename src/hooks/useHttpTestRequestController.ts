import { Buffer } from 'buffer';
import { useCallback, useState } from 'react';
import { ResolvedHttpReqData } from '@microsoft/api-docs-ui';
import { HttpStatusCodes } from '@/constants/HttpStatusCodes';

interface ResponseType {
  headers: Record<string, string>;
  statusCode: number;
  statusText: string;
  body: Buffer;
}

interface ReturnType {
  response?: ResponseType;
  error?: string;
  isLoading: boolean;
  send: (reqData: ResolvedHttpReqData) => Promise<void>;
}

/**
 * A hook to send HTTP requests from HTTP test console and handle the response.
 */
export default function useHttpTestRequestController(): ReturnType {
  const [response, setResponse] = useState<ResponseType>(undefined);
  const [error, setError] = useState<string>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(
    async (reqData: ResolvedHttpReqData) => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(reqData.url, {
          method: reqData.method,
          headers: Object.fromEntries(reqData.headers.map(({ name, value }) => [name, value])),
          body: reqData.body,
          redirect: 'manual',
        });

        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        setError(undefined);
        setResponse({
          headers: responseHeaders,
          statusCode: response.status,
          statusText: response.statusText || HttpStatusCodes[response.status] || 'Unknown',
          body: Buffer.from(await response.arrayBuffer()),
        });
      } catch (e) {
        setResponse(undefined);
        // TypeError is thrown when CORS is not enabled
        if (e instanceof TypeError) {
          setError(
            'Since the browser initiates the request, it requires Cross-Origin Resource Sharing (CORS) enabled on the server.'
          );
        } else {
          setError('Unable to complete request');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return {
    response,
    error,
    isLoading,
    send,
  };
}
