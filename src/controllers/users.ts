import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/user';
import { BaseController } from './index';
import AuthService from '@src/services/auth';
import ApiError from '@src/util/errors/api-errors';
import { authMiddleware } from '@src/middleware/auth';

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
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return res
        .status(401)
        .send(
          ApiError.format({ code: 401, message: 'Password does not match!' })
        );
    }

    // need format to json
    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ token });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found',
      });
    }

    return res.status(200).send({ user });
  }
}
