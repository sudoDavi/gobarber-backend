import IMailTemplateProvider from '../models/IEmailTemplateProvider';

export default class FakeEmailTemplateProvider
  implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
