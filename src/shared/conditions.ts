import { BadRequestResult } from './errors';

export class Conditions {
    static checkExistence<T>(value: T, message?: string): T {
        if (!value || !Conditions.stringValidation(value)) {
            throw new BadRequestResult(message);
        }
        return value;
    }

    private static stringValidation<T>(value: T): boolean {
        if (typeof value === 'string' && String(value).trim().length === 0) {
            return false;
        }
        return true;
    }
}
