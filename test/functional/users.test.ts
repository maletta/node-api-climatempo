import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });
  describe('When creating a new user ', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        mail: 'john@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('should return a 422 when there is a validation error', async () => {
      const newUser = {
        name: 'John Doe',
        mail: 'john@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'User validation failed: mail: Error, expected `mail` to be unique. Value: `john@mail.com`',
      });
    });
  });
});
