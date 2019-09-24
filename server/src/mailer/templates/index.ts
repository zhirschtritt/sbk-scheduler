import fs from 'fs';
import path from 'path';
import {TemplateName} from '../templator';

export default function(templateName: TemplateName) {
  return fs.readFileSync(path.join(__dirname, `${templateName}.hbs`), 'utf8');
}
