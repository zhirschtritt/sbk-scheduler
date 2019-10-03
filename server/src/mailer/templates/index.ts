import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'

function compileTemplate(templateName: string) {
  const hbs = fs.readFileSync(path.join(__dirname, `${templateName}.hbs`), 'utf8');
  Handlebars.precompile(hbs);
};

