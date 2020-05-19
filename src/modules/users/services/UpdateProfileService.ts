import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PasswordHashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }
    // This checks if the user is changing the password or just changing the email
    const passwordCheckIfChangingPassword = old_password || password;

    // This ensures that the db is called only if the user updates his email
    if (email !== user.email) {
      // This verifies if the new email is already in use
      if (await this.usersRepository.findByEmail(email)) {
        throw new AppError('This email adress is already in use');
      }

      // This ensures that the user can only change his email, if he inputs his password
      if (
        !passwordCheckIfChangingPassword ||
        !(await this.hashProvider.compareHash(
          passwordCheckIfChangingPassword,
          user.password,
        ))
      ) {
        throw new AppError(
          'You need to insert the password to change the email',
        );
      }

      user.email = email;
    }

    if (password && old_password) {
      if (old_password === password) {
        throw new AppError('New password should not be equal to old password');
      }
      const oldPasswordMatches = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPasswordMatches) {
        throw new AppError('Your need to input the correct old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
