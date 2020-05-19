import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the name and email of a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Johnny Guitar',
      email: 'myjohnny@email.com',
      password: '123456',
    });

    expect(updatedUser.name).toBe('Johnny Guitar');
    expect(updatedUser.email).toBe('myjohnny@email.com');
  });
  it('should be able to update just the name of a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Johnny Guitar',
      email: 'johndoe@email.com',
    });

    expect(updatedUser.name).toBe('Johnny Guitar');
    expect(updatedUser.email).toBe('johndoe@email.com');
  });

  it('should not be able to update a non-existent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existent-user',
        name: 'Test',
        email: 'Test',
        password: 'test123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of a user using an already registered email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'John Edo',
      email: 'johnedo@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnedo@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email of a user without password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnedo@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email of a user with wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnedo@email.com',
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password of a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'newpassword',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('newpassword');
  });

  it('should be able to update the profile of a user while changing his password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Johnny Guitar',
      email: 'myjohnny@email.com',
      password: 'newpassword',
      old_password: '123456',
    });

    expect(updatedUser.name).toBe('Johnny Guitar');
    expect(updatedUser.email).toBe('myjohnny@email.com');
    expect(updatedUser.password).toBe('newpassword');
  });

  it('should not be able to update the password of a user without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'newpassword',
    });

    await expect(updatedUser.password).not.toBe('newpassword');
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'newpassword',
        old_password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not updated the password if it is equal to old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
        old_password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
