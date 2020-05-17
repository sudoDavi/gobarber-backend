import IParseEmailTemplateDTO from '@shared/container/providers/EmailTemplateProvider/dtos/IParseEmailTemplateDTO';

export default interface ISendEmailDTO {
  to: {
    name: string;
    email: string;
  };
  from?: {
    name: string;
    email: string;
  };
  subject: string;
  templateData: IParseEmailTemplateDTO;
}
