import {BadRequestResult, InternalServerErrorResult} from '../shared/errors';

export const SensorDataErrorCode = {
    InvalidSensorId: () => new BadRequestResult(
        'error.sensorId.invalid'
    ),
    InternalServerError: () => new InternalServerErrorResult(
        'error.server.error'
    ),
    InvalidJSON: () => new BadRequestResult(
        'body.json.invalid'
    ),
    SlackPublishingError: () => new InternalServerErrorResult(
        'error.slack.publish.failed'
    )
};
