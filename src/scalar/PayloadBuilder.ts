import {Payload} from "./Payload";
export class PayloadBuilder implements Partial<Payload> {
    Temperature: string
    Timestamp: Date

    withTemperature(value: string): this & Pick<Payload, 'Temperature'> {
        return Object.assign(this, { Temperature: value });
    }

    withTimestamp(value: Date): this & Pick<Payload, 'Timestamp'> {
        return Object.assign(this, { Timestamp: value });
    }


    build(this: Payload) {
        return new Payload(this);
    }
}
