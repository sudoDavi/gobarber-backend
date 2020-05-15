import IEmailProvider from '../models/IEmailProvider';

interface IEmail {
  to: string;
  body: string;
}

export default class FakeEmailProvider implements IEmailProvider {
  private emails: IEmail[] = [];

  public async sendEmail(to: string, body: string): Promise<void> {
    this.emails.push({ to, body });
  }
}
