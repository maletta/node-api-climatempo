import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/user';
import { BaseController } from './index';
import AuthService from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body);
      const result = await newUser.save();

      // mongoose automatically format to json
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ code: 401, error: 'User not found!' });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return res
        .status(401)
        .send({ code: 401, error: 'Password does not match!' });
    }

    // need format to json
    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ token });
  }
}
