import moment from 'moment';

export default function formatDateWithWeekday(date) {
  return moment(date).format('ddd, MMM D, YYYY');
}
