function getTimeUntilEndOfDayInSeconds() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return Math.ceil((endOfDay.getTime() - now.getTime()) / 1000);
}

export default getTimeUntilEndOfDayInSeconds;