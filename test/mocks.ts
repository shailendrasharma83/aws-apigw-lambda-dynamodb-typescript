import {SensorDataService} from "../src/services/sensor-data.service";
import {ResponseBuilder} from '../src/shared/response-builder';
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

export const MockSNS = jest.fn(() => ({
    publish: jest.fn((params: any, callback: (err: any, data: any) => void) => {
        callback(null, {});
    })
}));

export const anySensorId = "anySensorId"
export const anyTopic = "anyTopic"
export const anyTemperature = "anyTopic"
export const anyDate = new Date().toISOString()

const mockRequest = {
    promise: jest.fn().mockImplementation((params) => {
        return Promise.resolve({
            "Items": [{
                "SensorId": {"S": anySensorId},
                "Timestamp": {"S": anyDate},
                "Topic": {"S": anyTopic},
                "Payload": {
                    "M": {
                        "Timestamp": {"S": anyDate},
                        "Temperature": {"S": anyTemperature},
                    }
                }
            }
            ]
        });
    })
}

const mockErrorRequest = {
    promise: jest.fn().mockImplementation((params) => {
        throw new Error()
    })
}

export const MockDynamoDBErrorResponses = {
    query: jest.fn().mockImplementation((params) => {
        return mockErrorRequest
    }),
    putItem: jest.fn().mockImplementation((params) => {
        return mockErrorRequest
    }),
    delete: jest.fn().mockImplementation((params) => {
        return mockErrorRequest
    })
}

export const MockDynamoDB = {
    query: jest.fn().mockImplementation((params) => {
        return mockRequest
    }),
    putItem: jest.fn(),
    delete: jest.fn()
}

const mockRequestEmptyGet = {
    promise: jest.fn().mockImplementation((params) => {
        return Promise.resolve({"Items": []});
    })
}
export const MockDynamoDBEmptyGet = {
    query: jest.fn().mockImplementation((params) => {
        return mockRequestEmptyGet
    }),
    putItem: jest.fn(),
    delete: jest.fn()
}
