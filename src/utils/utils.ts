export function formatDate (date: Date): string {
  const [_year, month, day] = date.toISOString().split('T')[0].replace(/-/g, '-').split('-') // eslint-disable-line
  return `${month}-${day}`
}
