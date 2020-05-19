// import { isUuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUsersRepository: FakeUsersRepository;
let resetPassword: ResetPasswordService;
let fakePasswordHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakePasswordHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakePasswordHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: 'password',
      name: 'John Doe',
    });
    const resetToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakePasswordHashProvider, 'generateHash');

    await resetPassword.execute({
      token: resetToken.token,
      password: 'drowssap',
    });

    const userWithNewPassword = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('drowssap');
    expect(userWithNewPassword?.password).toBe('drowssap');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'invalid user id',
    );
    await expect(
      resetPassword.execute({ token, password: 'password' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with an expired token', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: 'password',
      name: 'John Doe',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const dateInTheFuture = new Date();

      return dateInTheFuture.setHours(dateInTheFuture.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: 'password',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
