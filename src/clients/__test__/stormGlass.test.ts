import axios from 'axios';

import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  // do mockedAxios have jest and axios types;
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('Should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.123123;
    const lng = 151.123123;

    // mock axios data avoid overriding the axios function
    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });
    // dont need overriding because we have mocked axios with jest.mock("axios")
    // mock axios data overriding axios function
    // axios.get = jest
    //   .fn()
    //   .mockReturnValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
