import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class LostPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const doesUserExist = await this.usersRepository.findByEmail(email);

    if (!doesUserExist) {
      throw new AppError('User not registered', 404);
    }

    await this.userTokensRepository.generate(doesUserExist.id);

    this.emailProvider.sendEmail(email, 'Recover Password');
  }
}

export default LostPasswordEmailService;
