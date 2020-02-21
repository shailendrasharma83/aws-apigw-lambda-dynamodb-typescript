import {ApiCallback, ApiContext, ApiEvent, ApiHandler} from '../shared/api-interfaces';
import {SensorDataService} from '../services/sensor-data.service';
import {ResponseBuilder} from "../shared/response-builder";
import {SensorData} from "../scalar/SensorData";
import {Conditions} from "../shared/conditions";
import {SensorDataErrorCode} from "../constants/sensor-data-error-code";
import {DeletionNotification} from "../scalar/DeletionNotification";
import * as AWS from 'aws-sdk';

const awsSns = new AWS.SNS()

export class SensorDataController {

    public constructor(private sensorDataService: SensorDataService, private responseBuilder: ResponseBuilder) {
    }

    public querySensorData: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback): Promise<void> => {
        let sensorId: string;
        try {
            sensorId = event.pathParameters.sensorId;
            Conditions.checkExistence(sensorId, 'error.sensorId.invalid')
            let response: SensorData = await this.sensorDataService.querySensorData(sensorId)
            return this.responseBuilder.ok<SensorData>(response, callback);
        } catch (error) {
            return this.responseBuilder.error(error, callback);
        }
    }

    public createOrUpdateSensorData: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback): Promise<void> => {
        try {
            console.log(event)
            let request = this.parsePostRequestFrom(JSON.parse(event.body), this.parseBody);
            let response: SensorData = await this.sensorDataService.createOrUpdateSensorData(request)
            return this.responseBuilder.ok<SensorData>(response, callback);
        } catch (error) {
            return this.responseBuilder.error(error, callback);
        }

    }

    public deleteSensorData: ApiHandler = async (event: ApiEvent, context: ApiContext, callback: ApiCallback): Promise<void> => {
        try {
            let request = this.parsePostRequestFrom(JSON.parse(event.body), this.parseBody);

            let response: SensorData = await this.sensorDataService.deleteSensorData(request)

            await this.triggerConfirmationEmail(new DeletionNotification(response, "sensor-data"))

            return this.responseBuilder.ok({}, callback);
        } catch (error) {
            return this.responseBuilder.error(error, callback);
        }
    }

    private triggerConfirmationEmail(deletionNotification: DeletionNotification): Promise<void> {
        return new Promise((resolve, reject: (error: Error) => void): void => {
            try {
                const message = {
                    default: JSON.stringify(deletionNotification)
                };

                const params = {
                    Message: JSON.stringify(message),
                    MessageStructure: 'json',
                    TopicArn: process.env.TOPIC_ARN
                };

                awsSns.publish(params).promise();
                resolve()
            } catch (error) {
                console.error(`triggerConfirmationEmail:ERROR\n${error}\n${error.stack}`);
                reject(error);
            }
        })
    }


    private parsePostRequestFrom(event: any, parseBody: Function): SensorData {
        if (!event) {
            throw SensorDataErrorCode.InvalidJSON();
        } else {
            try {
                return parseBody(event) as SensorData;
            } catch (error) {
                console.log('Invalid JSON :: Error - ' + error.message);

                if (error.status === 400) {
                    throw error;
                }
                throw SensorDataErrorCode.InvalidJSON();
            }
        }
    }

    private parseBody(event: any): SensorData {
        const parsedRequestBody: SensorData = JSON.parse(JSON.stringify(event));
        console.log("parsedRequestBody")
        console.log(parsedRequestBody)

        Conditions.checkExistence(parsedRequestBody, 'body.json.invalid');
        Conditions.checkExistence(parsedRequestBody.SensorId, 'error.SensorId.invalid');
        Conditions.checkExistence(parsedRequestBody.Timestamp, 'error.TimeStamp.invalid');
        Conditions.checkExistence(parsedRequestBody.Topic, 'error.Topic.invalid');
        Conditions.checkExistence(parsedRequestBody.Payload, 'error.Payload.invalid');

        return {
            SensorId: parsedRequestBody.SensorId,
            Timestamp: parsedRequestBody.Timestamp,
            Topic: parsedRequestBody.Topic,
            Payload: parsedRequestBody.Payload,
        } as SensorData;
    }
}

