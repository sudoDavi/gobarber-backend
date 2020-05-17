import { inject, injectable } from 'tsyringe';
import { isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class RsetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('PasswordHashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token not found');
    }

    const tokenDate = userToken.created_at;

    const expireDate = new Date(tokenDate).setHours(tokenDate.getHours() + 2);

    // The code stopped working for some reason, so I had to change it and this
    // console.log is for testing the test
    // console.log(
    //   'data: %s expire_date: %s bool: %s',
    //   tokenDate,
    //   new Date(expireDate),
    //   isAfter(Date.now(), expireDate),
    // );

    if (isAfter(Date.now(), expireDate)) {
      throw new AppError('Expired Token');
    }

    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default RsetPasswordService;
