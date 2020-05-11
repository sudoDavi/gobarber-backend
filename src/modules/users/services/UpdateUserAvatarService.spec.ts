import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should upload a user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'Avatar_File_Name.jpg',
    });

    expect(user.avatar).toEqual('Avatar_File_Name.jpg');
  });

  it('should delete the old avatar when uploading a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'Avatar_File_Name.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'Different_Avatar_File_Name.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('Avatar_File_Name.jpg');

    expect(user.avatar).toEqual('Different_Avatar_File_Name.jpg');
  });

  it('should not upload avatar to a non-existant user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existant user_id',
        avatarFilename: 'Avatar_File_Name.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
