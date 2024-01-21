import StockModel from "../models/Stock.js";
const findOneStockData = async (date) => {
    try {
        return await StockModel.findOne({ date });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error; 
    }
};

const getStockByDate = async (req, res) => {
    const { date } = req.params;

    try {
        console.log('Request received for date:', date);
        const stockData = await findOneStockData(date);
        if (!stockData) {
            return res.status(404).json({ error: 'Stock data not found for the given date' });
        }
        return res.json(stockData);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default getStockByDate 