import { Beach, BeachPosition } from '@src/models/beach';
import { Rating } from '../rating';

describe('Rating service', () => {
  const defaultBeach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Many',
    position: BeachPosition.E,
    user: 'some-user',
  };

  const defaultRating = new Rating(defaultBeach);

  describe('Calculate rating for a given point', () => {
    //TODO
  });

  /**
   * Wind and Wave calculation by beach position, cálculo da direção do vento e da onda em relação a praia
   */
  describe('Get rating based on wind and wave position', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      // onshore wind vento a favor da praia, vento tem que vir oposto pra ser bom
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E
      );

      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      // cross wind é vento lateral
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.N,
        BeachPosition.E
      );

      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      // offshore wind é vento que vem ao contra as ondas da praia, bate de frente com as ondas
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W
      );

      expect(rating).toBe(5);
    });
  });

  /**
   * Period calculation only test, intervalo de tempo que a onda vem, quanto maior, maior a onde vem
   */

  describe('Get rating based on swell period', () => {
    it('should get a rating of 1 for a perid of 5 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);

      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for a perid of 9 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);

      expect(rating).toBe(2);
    });

    it('should get a rating of 4 for a perid of 12 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);

      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for a perid of 16 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);

      expect(rating).toBe(5);
    });
  });

  /**
   * Swell height specific logic calculation
   */
  describe('Get rating based on swell height', () => {
    it('should get rating 1 for less than ankle to knee high swell', () => {
      // ankle to knee high é do tornozelo ao joelho
      const rating = defaultRating.getRatingForSwellSize(0.2);

      expect(rating).toBe(1);
    });

    it('should get rating 2 for a than ankle to knee swell', () => {
      const rating = defaultRating.getRatingForSwellSize(0.6);

      expect(rating).toBe(2);
    });

    it('should get rating 3 for waist high swell', () => {
      // waist é cintura
      const rating = defaultRating.getRatingForSwellSize(1.5);

      expect(rating).toBe(3);
    });

    it('should get rating 5 overhead swell', () => {
      // overhead maior que as pessoas
      const rating = defaultRating.getRatingForSwellSize(2.5);

      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific calculation, converter graus de posição em NSEW
   */
  describe('Get position based on points location', () => {
    it('should get the point based on a east location', () => {
      const response = defaultRating.getPositionFromLocation(92);

      expect(response).toBe(BeachPosition.E);
    });

    it('should get the point based on a north location 1', () => {
      const response = defaultRating.getPositionFromLocation(360);

      expect(response).toBe(BeachPosition.N);
    });

    it('should get the point based on a north location 2', () => {
      const response = defaultRating.getPositionFromLocation(40);

      expect(response).toBe(BeachPosition.N);
    });

    it('should get the point based on a south location', () => {
      const response = defaultRating.getPositionFromLocation(200);

      expect(response).toBe(BeachPosition.S);
    });

    it('should get the point based on a west location', () => {
      const response = defaultRating.getPositionFromLocation(300);

      expect(response).toBe(BeachPosition.W);
    });
  });
});
