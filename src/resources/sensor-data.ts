import {SensorDataController} from './sensor-data.controller';
import {SensorDataService} from '../services/sensor-data.service';
import {ApiHandler, SlackHandler} from '../shared/api-interfaces';
import {ResponseBuilder} from "../shared/response-builder";
import {NotificationController} from "./notification.controller";

const sensorDataService = new SensorDataService();
const responseBuilder = new ResponseBuilder();

export const querySensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder).querySensorData;
export const createOrUpdateSensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder).createOrUpdateSensorData;
export const deleteSensorData: ApiHandler = new SensorDataController(sensorDataService, responseBuilder).deleteSensorData;
export const slackNotifier: SlackHandler = new NotificationController().publishToSlack
