import { DecodedUser } from '@src/services/auth';

export {};

declare global {
  namespace Express {
    export interface Request {
      decoded?: DecodedUser;
    }
  }
}
