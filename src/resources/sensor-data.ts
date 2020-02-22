import {SensorDataController} from './sensor-data.controller';
import {SensorDataService} from '../services/sensor-data.service';
import {ApiHandler, SlackHandler} from '../shared/api-interfaces';
import {ResponseBuilder} from "../shared/response-builder";
import {NotificationController} from "./notification.controller";
import * as AWS from 'aws-sdk';

const awsSns = new AWS.SNS();
const dynamoDB = new AWS.DynamoDB();
const sensorDataService = new SensorDataService(dynamoDB);
const responseBuilder = new ResponseBuilder();

export const querySensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder, awsSns).querySensorData;
export const createOrUpdateSensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder,awsSns).createOrUpdateSensorData;
export const deleteSensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder, awsSns).deleteSensorData;
export const slackNotifier: SlackHandler = new NotificationController().publishToSlack
