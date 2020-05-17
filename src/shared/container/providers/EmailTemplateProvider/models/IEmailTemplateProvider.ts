import IParseMailTemplateDTO from '../dtos/IParseEmailTemplateDTO';

export default interface IEmailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
