import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/user';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  @Post('')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body);
      const result = await newUser.save();

      res.status(201).send(result);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message });
      } else {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}
