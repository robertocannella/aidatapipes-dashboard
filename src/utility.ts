export function getCurrentWeek(): string {
    const now: Date = new Date(); // Get the current date
    const year: number = now.getFullYear(); // Get the current year
    const month: number = now.getMonth() +1; // Get the current month
    const date: number = now.getDate(); // Get the current day of the month
  
    const firstOfMonth: Date = new Date(year, month, 1); // Create a new date object for the first day of the month
    const firstDayOfWeek: number = firstOfMonth.getDay(); // Get the day of the week for the first day of the month (0 - Sunday, 6 - Saturday)
  
    const week: number = Math.ceil((date ) / 7); // Calculate the current week by dividing the sum of the current day and first day of the week by 7
  
    return `${year}-${month}-${week}`;
    
  }
  
 