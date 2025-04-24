export function formatDateToUzbek(dateString) {
    const date = new Date(dateString);
  
    const monthsUz = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
  
    const day = date.getUTCDate();
    const month = monthsUz[date.getUTCMonth()];
    const year = date.getUTCFullYear();
  
    return `${day}-${month}, ${year}-год`;
  }