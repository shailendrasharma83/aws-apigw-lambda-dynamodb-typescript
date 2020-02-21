import {ApiCallback, ApiResponse} from './api-interfaces';
import {HttpStatusCode} from './http-status-codes';
import {ErrorResult} from "./errors";

/**
 * Contains helper methods to generate a HTTP response.
 */
export class ResponseBuilder {
    public error(error: ErrorResult, callback: ApiCallback): void {
        this._returnAs<ErrorResult>(error, error.status, callback);
    }

    public ok<T>(result: T, callback: ApiCallback): void {
        this._returnAs<T>(result, HttpStatusCode.Ok, callback);
    }

    private _returnAs<T>(bodyObject: T, statusCode: number, callback: ApiCallback): void {
        const bodyString = JSON.stringify(bodyObject);

        const response: ApiResponse = {
            body: bodyString,
            statusCode
        };

        console.log("Response :: " + JSON.stringify(response))

        callback(undefined, response);
    }
}
