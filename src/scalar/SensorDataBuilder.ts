import {SensorData} from "./SensorData";
import { Payload } from "./Payload";
import {SensorDataService} from "../services/sensor-data.service";
import {ResponseBuilder} from "../shared/response-builder";

export class SensorDataBuilder implements Partial<SensorData>{
    SensorId: string;
    TimeStamp: Date;
    Topic: string;
    Payload: Payload

    public constructor() {

    }

    withSensorId(value: string): this & Pick<SensorData, 'SensorId'> {
        return Object.assign(this, { SensorId: value });
    }

    withTimeStamp(value: Date): this & Pick<SensorData, 'Timestamp'> {
        return Object.assign(this, { Timestamp: value });
    }

    withTopic(value: string): this & Pick<SensorData, 'Topic'> {
        return Object.assign(this, { Topic: value });
    }

    withPayload(value: Payload): this & Pick<SensorData, 'Payload'> {
        return Object.assign(this, { Payload: value });
    }

    build(this: SensorData) {
        return new SensorData(this);
    }
}
