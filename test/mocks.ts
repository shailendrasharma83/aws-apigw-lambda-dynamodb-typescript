import {SensorDataService} from "../src/services/sensor-data.service";
import { ResponseBuilder } from '../src/shared/response-builder';
import {ApiContext, ApiEvent} from "../src/shared/api-interfaces";
import {ProxyCallback, ProxyResult} from "aws-lambda";

export const MockSensorDataService = jest.fn<SensorDataService>(() => ({
    querySensorData: jest.fn(),
    createOrUpdateSensorData: jest.fn(),
    deleteSensorData: jest.fn()
}));

export const MockResponseBuilder = {
    error: jest.fn().mockImplementation((error, callback) => {
        callback(error);
    }),
    ok: jest.fn().mockImplementation((result, callback) => {
        callback(result);
    })
} as ResponseBuilder;

export const MockApiContext = {
    getRemainingTimeInMillis: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
    awsRequestId: 'awsRequestId'
} as ApiContext;

export const MockCallback = (error?: Error | null, result?: ProxyResult): ProxyCallback => jest.fn();

export class Mocks {
    mockedGetEvent(sensorId: string): ApiEvent {
        return {
            body: {},
            headers: {['']: ''},
            httpMethod: 'GET',
            isBase64Encoded: false,
            path: '',
            pathParameters: {sensorId: sensorId},
            queryStringParameters: {},
            stageVariables: undefined,
            requestContext: undefined,
            resource: ''
        };
    }
}
