import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middleware/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { rateLimit } from 'express-rate-limit';
import ApiError from '@src/util/errors/api-errors';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  keyGenerator(req: Request) : string {
    return req.ip;
  },
  handler(_, res: Response) : void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message:'To many requests to the /forecast endpoint',
      })
    )
  },
})

const forecast = new Forecast();
@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req?.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error) {
      // logger.error(error);
      // res.status(500).send({ error: 'Something went wrong' });
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
