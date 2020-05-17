import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IEmailProvider from './EmailProvider/models/IEmailProvider';
import EtherealMailProvider from './EmailProvider/implementations/EtherealMailProvider';

import IEmailTemplateProvider from './EmailTemplateProvider/models/IEmailTemplateProvider';
import HandlebarsEmailTemplateProvider from './EmailTemplateProvider/implementations/HandlebarsEmailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailTemplateProvider,
);
container.registerInstance<IEmailProvider>(
  'EmailProvider',
  container.resolve(EtherealMailProvider),
);
