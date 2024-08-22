export function formateDate(dateString: string) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', // "Mon"
    day: '2-digit', // "02"
    month: 'short', // "Jan"
    // year: 'numeric', // "2024"
    hour: 'numeric', // "11"
    minute: '2-digit', // "30"
    hour12: true, // "AM/PM"
  });
  const formattedDate = formatter.format(date);
  return formattedDate;
}
