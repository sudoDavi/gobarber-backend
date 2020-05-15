// import { isUuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/container/providers/EmailProvider/fakes/FakeEmailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeEmailProvider;
let createForgotPasswordEmail: SendForgotPasswordEmailService;

describe('LostPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    createForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using his e-mail', async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendEmail');

    await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: 'password',
      name: 'John Doe',
    });

    await createForgotPasswordEmail.execute({ email: 'johndoe@email.com' });

    expect(sendEmail).toBeCalled();
  });

  it('should not be able to recover the password for an unregistered user', async () => {
    await expect(
      createForgotPasswordEmail.execute({ email: 'johndoe@email.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateLostPasswordToken = jest.spyOn(
      fakeUserTokensRepository,
      'generate',
    );

    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      password: 'password',
      name: 'John Doe',
    });

    await createForgotPasswordEmail.execute({ email: 'johndoe@email.com' });

    expect(generateLostPasswordToken).toBeCalledWith(user.id);
  });
});
