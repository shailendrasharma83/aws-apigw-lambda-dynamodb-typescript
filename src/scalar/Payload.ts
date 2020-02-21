export class Payload {
    Temperature: string
    Timestamp: Date

    constructor(payload: Payload) {
        Object.assign(this, payload);
    }
}
