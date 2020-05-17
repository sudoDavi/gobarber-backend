import handlebars from 'handlebars';
import fs from 'fs';

import IEmailTemplateProvider from '../models/IEmailTemplateProvider';
import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';

export default class HandlebarsEmailTemplateProvider
  implements IEmailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseEmailTemplateDTO): Promise<string> {
    const templateFileCOntent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = await handlebars.compile(templateFileCOntent);

    return parseTemplate(variables);
  }
}
