
import StockModel from "../models/Stock.js";
const getStockHistory = async (req, res) => {
    const { code } = req.params;
  
    try {
        const stockData = await StockModel.find({
                'data': { $elemMatch: { 'SC_CODE': { $regex: new RegExp(code, 'i') } } }
            });
        
         
        if (!stockData || stockData.length === 0) {
            return res.status(404).json({ error: 'Stock data not found for the given name' });
        }
  
        // Extract the necessary data for the UI graph
        const stockHistory = stockData.map(stockDoc => ({
            date: stockDoc.date,
            stocks: stockDoc.data
                .filter(stock => new RegExp(code, 'i').test(stock.SC_CODE))
                .map(stock => ({
                    name: stock.SC_NAME, 
                    price: parseFloat(stock.CLOSE), 
                })),
        }));
  
        res.json(stockHistory);
    } catch (error) {
        console.error('Error fetching stock history data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export default getStockHistory;