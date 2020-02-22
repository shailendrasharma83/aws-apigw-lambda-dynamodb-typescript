import {SensorDataService} from "../../src/services/sensor-data.service";
import {anyDate, anySensorId, anyTemperature, anyTopic, MockDynamoDB, MockDynamoDBEmptyGet} from "../mocks";

const stringify = require('json-stable-stringify');
declare var describe, it, expect;

let classUnderTest: SensorDataService;
let mockDynamoDB;

beforeEach(() => {
    mockDynamoDB = MockDynamoDB
    process.env.AWS_REGION = "anyRegion"
    classUnderTest = new SensorDataService(mockDynamoDB);
    console.log = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});


describe('SensorDataService.querySensorData', () => {

    it('Should return data from DB if exists', () => {
        let params = {
            ExpressionAttributeValues: {
                ':SensorId': {S: anySensorId}
            },
            KeyConditionExpression: 'SensorId = :SensorId',
            TableName: "sensor-data"
        };

        let expectedResponse = {
            "SensorId": anySensorId,
            "Timestamp": anyDate,
            "Topic": anyTopic,
            "Payload": {
                "Timestamp": anyDate,
                "Temperature": anyTemperature,
            }
        };

        return classUnderTest.querySensorData(anySensorId).then((actualResponse) => {
            expect(classUnderTest.dynamodb.query).toHaveBeenCalledTimes(1);
            let params1 = classUnderTest.dynamodb.query.mock.calls[0][0];
            expect(params).toEqual(params1);
            expect(actualResponse).toEqual(expectedResponse);
        });
    });


    it('Should throw no data found exception when no record in DB exists for a given sensor id', () => {
        let params = {
            ExpressionAttributeValues: {
                ':SensorId': {S: anySensorId}
            },
            KeyConditionExpression: 'SensorId = :SensorId',
            TableName: "sensor-data"
        };
        classUnderTest.dynamodb = MockDynamoDBEmptyGet

        let expectedError = {
            "status": 404,
            "code": "error.no.data.found",
            "title": "No Data Found"
        };

        return classUnderTest.querySensorData(anySensorId).catch((error) => {
            expect(stringify(error)).toEqual(stringify(expectedError));
        });
    });

    it('Should throw error when DB call fails', () => {
        let params = {
            ExpressionAttributeValues: {
                ':SensorId': {S: anySensorId}
            },
            KeyConditionExpression: 'SensorId = :SensorId',
            TableName: "sensor-data"
        };
        this.dynamodb = MockDynamoDBEmptyGet

        let expectedError = {
            "status": 500,
            "code": "error.db.call.failed",
            "title": "Internal Server Error"
        };

        return classUnderTest.querySensorData(anySensorId).catch((error) => {
            expect(stringify(error)).toEqual(stringify(expectedError));
        });
    });


})
