import Favorite  from '../models/Favorite.js';
import StockModel from "../models/Stock.js";
const postFavorite = async (req, res) => {
    const { code } = req.params;
  
    try {
        // Find the most recent date
        const mostRecentDate = await StockModel.findOne()
            .sort({ 'date': -1 }) // Sort by date in descending order
            .limit(1)
            .select('date');
  
        if (!mostRecentDate) {
            return res.status(404).json({ error: 'No stock data found' });
        }
  
        // Use the most recent date to retrieve stock data with regex search
        const stockData = await StockModel.findOne({
                'date': mostRecentDate.date,
                'data': { $elemMatch: { 'SC_CODE': { $regex: new RegExp(code, 'i') } } }
            });
  
        if (!stockData || !stockData.data || stockData.data.length === 0) {
            return res.status(404).json({ error: 'Stock data not found for the given code' });
        }
  
        // Filter the data array to include only matching elements
        const filteredStockData = {
            date: stockData.date,
            data: stockData.data.filter(stock => new RegExp(code, 'i').test(stock.SC_CODE)),
        };
        console.log(filteredStockData.data)
    // Extract relevant fields to create a new Favorite
    const { SC_CODE, SC_NAME, OPEN, HIGH, LOW, CLOSE, LAST } = filteredStockData.data.find(stockItem =>
      stockItem.SC_CODE.toLowerCase() === code.toLowerCase()
    );
  
    // Create a new Favorite instance
    const newFavorite = new Favorite({
      SC_CODE,
      SC_NAME,
      OPEN,
      HIGH,
      LOW,
      CLOSE,
      LAST,
    });
  
    // Save the new Favorite to the database
    await newFavorite.save();
  
    return res.json({ success: true, message: 'Stock added to favorites' });
  } catch (error) {
    console.error('Error adding stock to favorites:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  }

export default postFavorite;