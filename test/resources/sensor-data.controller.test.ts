/* tslint:disable */
import {SensorDataController} from '../../src/resources/sensor-data.controller';
import {when} from 'jest-when';
import {MockApiContext, MockCallback, MockResponseBuilder, Mocks, MockSensorDataService} from '../mocks';
import {ResponseBuilder} from "../../src/shared/response-builder";
import {SensorDataService} from '../../src/services/sensor-data.service';
import {SensorDataErrorCode} from "../../src/constants/sensor-data-error-code";
import {SensorDataBuilder} from "../../src/scalar/SensorDataBuilder";
import {PayloadBuilder} from "../../src/scalar/PayloadBuilder";

declare var describe, it, expect;
let classUnderTest: SensorDataController;
let mockResponseBuilder: ResponseBuilder;
let mockSensorDataService: SensorDataService;
const sensorId = "1234"
let date;

beforeEach(() => {
    mockSensorDataService = new MockSensorDataService()
    mockResponseBuilder = MockResponseBuilder;
    classUnderTest = new SensorDataController(mockSensorDataService, MockResponseBuilder)
    console.log = jest.fn();
    date = new Date()
}

afterEach(() => {
    jest.clearAllMocks();
});

describe('SensorDataController.querySensorData', () => {
    const mocks = new Mocks();
    it('Should return error response for Invalid Sensor Id', () => {
        const error = SensorDataErrorCode.InvalidSensorId();

        classUnderTest.querySensorData(mocks.mockedGetEvent(""), MockApiContext, MockCallback);
        expect(mockResponseBuilder.error).toHaveBeenCalledTimes(1);
        expect(mockResponseBuilder.error).toHaveBeenCalledWith(error, MockCallback);
    });

    it('Should Get Sensor Data', done => {
        let response = {
            "SensorId": sensorId,
            "Timestamp": date.toISOString(),
            "Payload": {"Temperature": "10", "Timestamp": date.toISOString()},
            "Topic": "Temperature"
        }

        when(mockSensorDataService.querySensorData).calledWith(sensorId).mockReturnValue(Promise.resolve(buildSensorData()));

        let mockCallback = (data) => {
            return new Promise((resolve, reject) => {
                try {
                    expect(mockSensorDataService.querySensorData).toHaveBeenCalledTimes(1);
                    expect(mockSensorDataService.querySensorData).toHaveBeenCalledWith(sensorId);
                    expect(data).toEqual(response);
                    expect(mockResponseBuilder.ok).toHaveBeenCalledTimes(1);
                    expect(mockResponseBuilder.ok).toHaveBeenCalledWith(response, mockCallback);

                }
                done();
            });
        };
        classUnderTest.querySensorData(mocks.mockedGetEvent(sensorId), MockApiContext, mockCallback);
    });

    it('Should return error response when fetching fails', done => {
        const error = SensorDataErrorCode.InternalServerError()
        when(mockSensorDataService.querySensorData).calledWith(sensorId).mockReturnValue(Promise.reject(error));

        let mockCallback = (data) => {
            return new Promise((resolve, reject) => {
                try {
                    expect(mockSensorDataService.querySensorData).toHaveBeenCalledTimes(1);
                    expect(mockResponseBuilder.error).toHaveBeenCalledTimes(1);
                    expect(mockResponseBuilder.error).toHaveBeenCalledWith(error, mockCallback);
                }
                done();
            });
        };
        classUnderTest.querySensorData(mocks.mockedGetEvent(sensorId), MockApiContext, mockCallback);
    });
})

function buildSensorData() {
    return new SensorDataBuilder().withSensorId(sensorId)
        .withTimeStamp(date.toISOString()).withPayload(new PayloadBuilder().withTemperature("10").withTimestamp(date.toISOString()).build()).withTopic("Temperature").build()
}
