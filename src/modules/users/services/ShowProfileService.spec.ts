import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able return the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute({ user_id: user.id });

    expect(userProfile.name).toBe('John Doe');
    expect(userProfile.email).toBe('johndoe@email.com');
  });

  it('should not be able to return an un-existing user profile', async () => {
    await expect(
      showProfileService.execute({ user_id: 'non-existing-userId' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
