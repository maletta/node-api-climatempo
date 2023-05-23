import mongoose, { Document, Model } from 'mongoose';
import AuthService from '@src/services/auth';
import logger from '@src/logger';
// import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserModel extends Omit<User, '_id'>, Document {}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATE',
}

const schema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_: any, ret: any): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

/**
 * Validates the email and throws a validation error, otherwise it will throw a 500
 */
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

// anonymous function rather than arrow function to get context from "this"
// this is mongoose.Document
schema.pre<UserModel>('save', async function (): Promise<void> {
  // if exist password (is not only a name or email update) or is a password update then will encrypt
  if (!this.password || !this.isModified('password')) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    logger.error(`Error hashing the password for the user ${this.name}`, err);
  }
});

export const User: Model<User> = mongoose.model('User', schema);

// Apply the uniqueValidator plugin to userSchema.
// schema.plugin(mongooseUniqueValidator);
