import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

interface IClientError {
  code: number;
  error: string;
}

export abstract class BaseController {
  // só quem estender a classe poderá usar
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    const castingError =
      error instanceof mongoose.Error
        ? (error as mongoose.Error)
        : (error as Error);

    let clientError: IClientError;

    if (castingError instanceof mongoose.Error.ValidationError) {
      clientError = this.handleClientErrors(castingError);
      res.status(clientError.code).send(clientError);
    } else {
      clientError = { code: 500, error: 'Something went wrong' };
      res.status(500).send(clientError);
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): IClientError {
    // console.log(Object.keys(error.errors));
    const duplicatedKindError = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindError.length) {
      return { code: 409, error: error.message };
    } else {
      return { code: 422, error: error.message }; // 422 refence to data error
    }
  }
}
