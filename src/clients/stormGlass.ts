import { InternalError } from '@src/util/errors/internal-error';
import { AxiosError, AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string]: number;
}
export interface StormGlassPoint {
  readonly time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}
export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

// error by our side
export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlass {
  // params dont change
  readonly stormGlassApiParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  // data source
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: 'fake-token',
          },
        }
      );

      return this.normalizedResponse(response.data);
    } catch (err) {
      /**
       * This is handling the Axios errors specifically
       */
      const axiosError = err as AxiosError;
      if (
        axiosError instanceof Error &&
        axiosError.response &&
        axiosError.response.status
      ) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(axiosError.response.data)} Code: ${
            axiosError.response.status
          }`
        );
      }
      // The type is temporary given we will rework it in the upcoming chapters
      throw new ClientRequestError((err as { message: any }).message);
    }
  }

  private normalizedResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    //bind function with this becase filter is calling this function internal
    //other way to do filter(point => this.isValidPoint(point))
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
