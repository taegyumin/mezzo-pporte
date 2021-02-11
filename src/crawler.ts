/* eslint-disable @typescript-eslint/no-var-requires */
import { APIGatewayProxyHandler } from 'aws-lambda';
import middleware from './middleware';
import crawl from './index';

export const handler: APIGatewayProxyHandler = middleware(async () => {
  console.log('start handler');
  await crawl();
  console.log('end handler');
  return {
    statusCode: 200,
    body: 'ok',
  };
});
