import mongoose, { Model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface User {
  _id?: string;
  name: string;
  mail: string;
  password: string;
}

const schema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    mail: {
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

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(mongooseUniqueValidator);

export const User: Model<User> = mongoose.model('User', schema);
