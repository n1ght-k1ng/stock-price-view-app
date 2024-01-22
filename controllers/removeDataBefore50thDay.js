import StockModel from "../models/Stock.js";
async function removeDataBefore50thDay(req, res , next) {
    try {
      // Calculate the date of 51 days before the current date
      console.log("Refreshing data");
      console.log("Removing data before 50th day")
      const currentDate = new Date();
      const dateBefore51Days = new Date(currentDate);
      dateBefore51Days.setDate(currentDate.getDate() - 50);
  
      // Format the date if needed (e.g., as "YY-MM-DD")
        const day = ('0' + dateBefore51Days.getDate()).slice(-2);
        const month = ('0' + (dateBefore51Days.getMonth() + 1)).slice(-2);
        const year = dateBefore51Days.getFullYear().toString().slice(-2);
        


      const formattedDate = `${year}-${month}-${day}`;
      const deleteQuery = { date: { $lt: formattedDate } };
  
      // Execute the delete operation
      const result = await StockModel.deleteMany(deleteQuery);
  
      console.log(`${result.deletedCount} documents deleted.`);
    } catch (error) {
      console.error('Error removing previous data:, Holiday');
    } 

    next();
  }

export default removeDataBefore50thDay;