import {SensorData} from "./SensorData";

export class DeletionNotification {
    Timestamp: string
    TableName: string
    SensorData: SensorData

    constructor(sensorData: SensorData, tableName: string) {
        this.SensorData = sensorData
        this.TableName = tableName
        this.Timestamp = new Date().toISOString()
    }
}
