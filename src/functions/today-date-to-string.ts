export const todayDateToString = (data:Date = new Date()) => data.getFullYear() + '-' + ('0' + (data.getMonth() + 1)).substr(-2) + '-' + ('0' + data.getDate()).substr(-2);
