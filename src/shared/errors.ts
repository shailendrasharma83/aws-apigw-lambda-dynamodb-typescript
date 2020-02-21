export abstract class ErrorResult extends Error {
  public constructor(public status: number, public code: string, public title: string) {
    super(code);
  }
}

export class BadRequestResult extends ErrorResult {
  constructor(code) {
    super(400, code, 'Input Validation failure');
  }
}

export class InternalServerErrorResult extends ErrorResult {
  constructor(code) {
    super(500, code, 'Internal Server Error');
  }
}

export class NoDataFoundException extends ErrorResult {
  constructor(code) {
    super(404, code, 'No Data Found');
  }
}
