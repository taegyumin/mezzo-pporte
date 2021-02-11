import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

export type Handler = (
  event: APIGatewayProxyEvent
) => Promise<{
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}>;

type RawResponse = {
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
};

type Response = {
  statusCode: number;
  headers: {
    'Access-Control-Allow-Origin': '*';
  };
  body: string;
};

const middleware = (handler: Handler): APIGatewayProxyHandler => {
  return async (event, context): Promise<Response> => {
    const getResponseWithErrorHandler = async (): Promise<RawResponse> => {
      const taskWithTimeout = (): Promise<RawResponse> =>
        new Promise((resolve, reject) => {
          const remainingTimeBeforeStartMainTask = context.getRemainingTimeInMillis();
          const timeout = setTimeout(() => {
            reject(new Error('Task timed out'));
          }, remainingTimeBeforeStartMainTask - 2000);
          handler(event)
            .then((result) => {
              clearTimeout(timeout);
              resolve(result);
            })
            .catch((e) => {
              clearTimeout(timeout);
              reject(e);
            });
        });
      try {
        const result = await taskWithTimeout();
        return result;
      } catch (error) {
        error.name = `scheduled ${error.name}`;
        return {
          statusCode: error.statusCode ?? 500,
          body: { message: error.message },
        };
      }
    };

    const response = await getResponseWithErrorHandler();

    return {
      statusCode: response.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response.body),
    };
  };
};

export default middleware;
