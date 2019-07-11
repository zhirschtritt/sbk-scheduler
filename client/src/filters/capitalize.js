export default function capitalize(value) {
  if (!value) return '';

  return value
    .split(' ')
    .map(v => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' ');
}
