import moment from 'moment';

export default function formatDate(date) {
  return moment.utc(date).format('MMM D, YYYY');
}
