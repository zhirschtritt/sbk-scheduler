import {promises as fsp} from 'fs';
import path from 'path';
import moment from 'moment';
import Handlebars from 'handlebars';
import {NotificationContext} from '../services/notification/notification.interfaces';

export enum TemplateName {
  cancelledShift = 'cancelledShift',
  emptyShift = 'emptyShift',
  upcomingShift = 'upcomingShift',
  upcomingShiftsForWeek = 'upcomingShiftsForWeek',
}
export type TemplateType = keyof typeof TemplateName;

Handlebars.registerHelper('formatDate', function(date: Date) {
  return moment(date).format('dddd, MMM D, YYYY');
});

Handlebars.registerHelper('capitalize', function(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Handlebars.registerHelper('replaceLineBreaks', function(value: string) {
  let sanitizedValue;
  try {
    sanitizedValue = JSON.parse(value);
  } catch (err) {
    sanitizedValue = value;
  }
  return sanitizedValue.replace(/\n/g, '<br />');
});

compileTemplates();

async function compileTemplates() {
  const rawTemplates = await Promise.all(Object.keys(TemplateName).map(templateName => {
    return fsp.readFile(path.join(__dirname, 'templates', `${templateName}.hbs`), 'utf8');
  }))

  for (const template of rawTemplates) {
    Handlebars.precompile(template)
  }
}


export type EmailViewModel =
| {
    template: TemplateName.cancelledShift,
    context: Required<NotificationContext>
  }
| {
    template: TemplateName.upcomingShift | TemplateName.emptyShift,
    context: Pick<NotificationContext, 'shift'>
  }
| {
    template: TemplateName.upcomingShiftsForWeek,
    context: Pick<NotificationContext, 'shift'>[]
  }

export function formatEmail(emailViewModel: EmailViewModel) {
  const template =  Handlebars.templates[emailViewModel.template]
  if (!template) {
    throw new Error('No matching template');
  }

  return template(context)
}
