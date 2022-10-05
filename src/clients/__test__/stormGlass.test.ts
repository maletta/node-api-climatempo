// import axios from 'axios';
import * as HTTPUtil from '@src/util/request';

import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

// jest.mock('axios');
jest.mock('@src/util/request');

describe('StormGlass client', () => {
  // get mocked class, used to static method's mocks, is different to get mocked instance
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  // do mockedAxios have jest and axios types;
  // const mockedAxios = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>; // mocked instance, used to instance method's mocks
  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    // mock axios data avoid overriding the axios function
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    });
    // dont need overriding because we have mocked axios with jest.mock("axios")
    // mock axios data overriding axios function
    // axios.get = jest
    //   .fn()
    //   .mockReturnValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue('Network Error');

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: "Network Error"'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      })
    );

    // acho que tem que mockar o retorno das funções isRequestError, extractErrorData porque elas são estáticas,
    // porque se não mockar o retorno elas não retornam o que deveriam, pq aparentemente o código dentro das funções
    // estáticas nem é executado, testei inserindo log dentro as funções estáticas, logs não são invocados
    MockedRequestClass.isRequestError.mockReturnValue(true);

    MockedRequestClass.extractErrorData.mockReturnValue({
      status: 429,
      data: { errors: ['Rate Limit reached'] },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
