import { container } from 'tsyringe';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';

const storage = {
  disk: DiskStorageProvider,
};

container.registerSingleton<IStorageProvider>('StorageProvider', storage.disk);
