
// Adjust the path accordingly
import StockModel from "../models/Stock.js";
const getTop10Stocks = async (req , res) =>{
  try {
    const date = await StockModel.findOne()
    .sort({ 'date': -1 }) // Sort by date in descending order
    .limit(1)
    .select('date');
    console.log(date.date);
if (!date) {
    return res.status(404).json({ error: 'No stock data found' });
}
    const topStocks = await StockModel.findOne({ date: date.date })
    console.log(topStocks.data);
    const topStocksArray = Object.values(topStocks.data);
    console.log(topStocksArray);
    
    const stocksWithIncrease = topStocksArray.map(stock => ({
            SC_CODE: stock.SC_CODE,
            SC_NAME: stock.SC_NAME,
      increase: parseFloat(stock.CLOSE) - parseFloat(stock.OPEN),
    }));
    stocksWithIncrease.sort((a, b) => b.increase - a.increase);
    const top10Stocks = stocksWithIncrease.slice(0, 10);
    res.json(top10Stocks);
  } catch (error) {
    console.error('Error retrieving top 10 stocks:', error);
    throw error;
  }
}
export default getTop10Stocks;