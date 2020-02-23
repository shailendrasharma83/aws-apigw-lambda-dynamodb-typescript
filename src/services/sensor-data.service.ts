import {SensorData} from "../scalar/SensorData";
import {SensorDataBuilder} from "../scalar/SensorDataBuilder";
import {PayloadBuilder} from "../scalar/PayloadBuilder";
import {InternalServerErrorResult, NoDataFoundException} from "../shared/errors";
import {AttributeValue, DeleteItemInput, PutItemInput, PutItemInputAttributeMap} from "aws-sdk/clients/dynamodb";

export class SensorDataService {
    public constructor(private dynamodb: AWS.DynamoDB) {
    }

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
                result = await this.dynamodb.query(params).promise();

                if (!result || !result.Items.length) throw new NoDataFoundException('error.no.data.found')

                result.Items.forEach((item) => {
                    let data = new SensorDataBuilder().withSensorId(item.SensorId.S)
                        .withTimeStamp(item.Timestamp.S).withPayload(new PayloadBuilder().withTemperature(item.Payload.M.Temperature.S).withTimestamp(item.Payload.M.Timestamp.S).build()).withTopic(item.Topic.S).build()
                    results.push(data);
                })
                resolve(results[0])
            } catch (error) {
                console.error(error)
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
                            } as AttributeValue,
                            "Timestamp": {
                                S: sensorData.Timestamp.toISOString()
                            } as AttributeValue,
                            "Topic": {
                                S: sensorData.Topic
                            } as AttributeValue,
                            "Payload": {
                                M: {
                                    "Temperature": {"S": sensorData.Payload.Temperature},
                                    "Timestamp": {"S": sensorData.Payload.Timestamp.toISOString()}
                                }
                            } as AttributeValue
                        } as PutItemInputAttributeMap,
                        ReturnConsumedCapacity: "NONE",
                        TableName: "sensor-data"
                    } as PutItemInput;
                    console.log(JSON.stringify(params))

                    await this.dynamodb.putItem(params).promise();
                    resolve(sensorData)
                } catch (error) {
                    console.error(error)
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
                        } as AttributeValue,
                        "Timestamp": {
                            S: sensorData.Timestamp.toISOString()
                        } as AttributeValue
                    },
                    TableName: "sensor-data"
                } as DeleteItemInput;
                let data: SensorData = await this.querySensorData(sensorData.SensorId)
                await this.dynamodb.deleteItem(params).promise();
                resolve(data)
            } catch (error) {
                console.error(error)
                reject(new InternalServerErrorResult('error.db.call.failed'))
            }
        });
    }
}

