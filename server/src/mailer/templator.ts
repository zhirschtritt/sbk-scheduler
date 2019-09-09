import moment from 'moment';
import Handlebars from 'handlebars';
import templates = require('./templates');
import {NotificationContext} from '../services/notification/notification.interfaces';

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

export enum TemplateName {
  cancelledShift = 'cancelledShift',
  emptyShift = 'emptyShift',
  upcomingShift = 'upcomingShift',
}
export type TemplateType = keyof typeof TemplateName;

export function getTemplateByName(templateName: TemplateType) {
  switch (templateName) {
    case TemplateName.cancelledShift:
      return templates(TemplateName.cancelledShift);
    case TemplateName.emptyShift:
      return templates(TemplateName.emptyShift);
    case TemplateName.upcomingShift:
      return templates(TemplateName.upcomingShift);
    default:
      return '';
  }
}

export function formatEmail(templateName: TemplateType, context: NotificationContext) {
  const template = getTemplateByName(templateName);
  const handlebars = Handlebars.compile(template);

  const compiledTemplate = handlebars(context);
  return compiledTemplate;
}
