
import StockModel from "../models/Stock.js";
const getStockByName = async (req, res) => {
    const { name } = req.params;
  
    try {
        // Find the most recent date
        const mostRecentDate = await StockModel.findOne()
            .sort({ 'date': -1 }) // Sort by date in descending order
            .limit(1)
            .select('date');
  
        if (!mostRecentDate) {
            return res.status(404).json({ error: 'No stock data found' });
        }
        const stockData = await StockModel.findOne({
                'date': mostRecentDate.date,
                'data': { $elemMatch: { 'SC_NAME': { $regex: new RegExp(name, 'i') } } }
            });
  
        if (!stockData || !stockData.data || stockData.data.length === 0) {
            return res.status(404).json({ error: 'Stock data not found for the given name' });
        }
  
        // Filter the data array to include only matching elements
        const filteredStockData = {
            date: stockData.date,
            data: stockData.data.filter(stock => new RegExp(name, 'i').test(stock.SC_NAME)),
        };
  
        return res.json(filteredStockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export default getStockByName;