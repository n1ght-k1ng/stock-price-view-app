
// middleware to validate stock code

import StockModel from "../models/Stock.js";
const validateStockCode = async (req, res, next) => {
    const { code } = req.params;
    try {
        const stockData = await StockModel.findOne({
            'data': { $elemMatch: { 'SC_CODE': { $regex: new RegExp(code, 'i') } } }
        });
        if (!stockData || stockData.length === 0) {
            return res.status(404).json({ error: 'Invalid Stock Code' });
        }
        next();
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default validateStockCode;