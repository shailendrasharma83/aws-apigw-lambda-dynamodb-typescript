import {ApiCallback, ApiContext, SlackHandler} from "../shared/api-interfaces";
import {SNSEvent} from "aws-lambda";
import {SensorDataErrorCode} from "../constants/sensor-data-error-code";

const https = require('https');
const util = require('util');

export class NotificationController {
    public publishToSlack: SlackHandler = async (event: SNSEvent, context: ApiContext, callback: ApiCallback): Promise<void> => {
        try {
            const postData = {
                "channel": "#notify-sensor-data-deletion",
                "text": "*" + event.Records[0].Sns.Subject + "*",
                "attachments": [{
                    "color": "warning",
                    "text": event.Records[0].Sns.Message
                }]
            };

            const options = {
                method: 'POST',
                hostname: 'hooks.slack.com',
                port: 443,
                path: process.env.SLACK_URL
            };

            let req = await https.request(options).promise()
            req.write(util.format("%j", postData));
            req.end();
        } catch (error) {
            console.log("Slack Publishing Error")
            throw SensorDataErrorCode.SlackPublishingError();
        }
    }
}
