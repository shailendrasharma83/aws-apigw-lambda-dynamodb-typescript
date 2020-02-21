import {SensorData} from "../scalar/SensorData";
import {SensorDataBuilder} from "../scalar/SensorDataBuilder";
import {PayloadBuilder} from "../scalar/PayloadBuilder";
import {InternalServerErrorResult, NoDataFoundException} from "../shared/errors";

const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB();

export class SensorDataService {
    public querySensorData(sensorId: string): Promise<SensorData> {
        return new Promise<SensorData>(async (resolve, reject) => {
            let results: SensorData[] = [], result
            try {
                let params = {
                    ExpressionAttributeValues: {
                        ':SensorId': {S: sensorId}
                    },
                    KeyConditionExpression: 'SensorId = :SensorId',
                    TableName: "sensor-data"
                };
                result = await dynamodb.query(params).promise();

                if (!result || !result.Items.length) throw new NoDataFoundException('error.no.data.found')

                result.Items.forEach((item) => {
                    let data = new SensorDataBuilder().withSensorId(item.SensorId.S)
                        .withTimeStamp(item.Timestamp.S).withPayload(new PayloadBuilder().withTemperature(item.Payload.M.Temperature.S).withTimestamp(item.Payload.M.Timestamp.S).build()).withTopic(item.Topic.S).build()
                    results.push(data);
                })
                resolve(results[0])
            } catch (error) {
                console.log(error)
                if (error.status === 404) {
                    reject(error)
                }
                reject(new InternalServerErrorResult('error.db.call.failed'))
            }
        });
    }

    public createOrUpdateSensorData(sensorData: SensorData): Promise<SensorData> {
        return new Promise<SensorData>(async (resolve, reject) => {
                try {
                    let params = {
                        Item: {
                            "SensorId": {
                                S: sensorData.SensorId
                            },
                            "Timestamp": {
                                S: sensorData.Timestamp
                            },
                            "Topic": {
                                S: sensorData.Topic
                            },
                            "Payload": {
                                M: {
                                    "Temperature": {"S": sensorData.Payload.Temperature},
                                    "Timestamp": {"S": sensorData.Payload.Timestamp}
                                }
                            }
                        },
                        ReturnConsumedCapacity: "NONE",
                        TableName: "sensor-data"
                    };
                    console.log(JSON.stringify(params))

                    await dynamodb.putItem(params).promise();
                    resolve(sensorData)
                } catch
                    (error) {
                    console.log(error)
                    reject(new InternalServerErrorResult('error.db.call.failed'))
                }
            }
        );
    }

    public deleteSensorData(sensorData: SensorData): Promise<SensorData> {
        return new Promise<SensorData>(async (resolve, reject) => {
            try {
                let params = {
                    Key: {
                        "SensorId": {
                            S: sensorData.SensorId
                        },
                        "Timestamp": {
                            S: sensorData.Timestamp
                        }
                    },
                    TableName: "sensor-data"
                };
                let data: SensorData = await this.querySensorData(sensorData.SensorId)
                await dynamodb.deleteItem(params).promise();
                resolve(data)
            } catch (error) {
                console.log(error)
                reject(new InternalServerErrorResult('error.db.call.failed'))
            }
        });
    }
}

