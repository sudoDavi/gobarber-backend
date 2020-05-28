import { container } from 'tsyringe';

import IEmailTemplateProvider from './models/IEmailTemplateProvider';
import HandlebarsEmailTemplateProvider from './implementations/HandlebarsEmailTemplateProvider';

const templates = {
  handlebars: HandlebarsEmailTemplateProvider,
};

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  templates.handlebars,
);
