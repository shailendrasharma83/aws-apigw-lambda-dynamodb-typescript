import {Payload} from "./Payload";
import {isNullOrUndefined} from "util";

export class SensorData {
    SensorId: string;
    Timestamp: Date;
    Topic: string;
    Payload: Payload

    constructor(sensorData: SensorData) {
        Object.assign(this, sensorData);
    }

    static toJSONAPI(sensorData: SensorData): any {
        return {
            'id': generateUUID,
            'type': 'sensor-data',
            'attributes': {
                'SensorId': sensorData.SensorId,
                'Timestamp': sensorData.Timestamp,
                'Topic': sensorData.Topic,
                'Payload' : sensorData.Payload
            }
        };
    }
}

const generateUUID = function() {
    return"uuid-"+((new Date).getTime().toString(16)+Math.floor(1E7*Math.random()).toString(16));
}
