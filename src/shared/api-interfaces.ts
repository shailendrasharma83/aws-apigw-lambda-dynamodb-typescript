import {APIGatewayEvent, Context, ProxyCallback, ProxyResult, SNSEvent} from 'aws-lambda';

export type ApiCallback = ProxyCallback;
export type ApiContext = Context;
export type ApiEvent = APIGatewayEvent;
export type ApiResponse = ProxyResult;
export type ApiHandler =  (event: APIGatewayEvent, context: Context, callback: ApiCallback) => void;
export type SlackHandler = (event: SNSEvent, context: Context, callback: ApiCallback) => void;
