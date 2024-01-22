import { Router } from 'express';
const router = Router();
import NodeCache from 'node-cache';

import getTop10Stocks from '../controllers/getTop10Stocks.js';
import getStockByDate from '../controllers/getStockByDate.js';
import validateDateFormat from '../middlewares/validateDateFormat.js';
import validateStockCode from '../middlewares/validateStockCode.js';
import getStockByName from '../controllers/getStockByName.js';
import getStockHistory from '../controllers/getStockHistory.js';
import postFavorite from '../controllers/postFavorite.js';
import deleteFavorite from '../controllers/deleteFavorite.js';
import getFavorites from '../controllers/getFavorites.js';
import getTimeUntilEndOfDayInSeconds from '../utils/getEOD.js';
import removeDataBefore50thDay from '../controllers/removeDataBefore50thDay.js';
import fetchStockInfo from '../controllers/fetchStockInfo.js';

const cache = new NodeCache({ stdTTL: 300 });

// Middleware function for caching with custom TTL
const cacheMiddleware = (ttl) => (req, res, next) => {
    const key = req.originalUrl;
    const cachedData = cache.get(key);

    if (cachedData) { 
        res.json(cachedData);
        return;
    }
    next();
}

router.get('/',cacheMiddleware(getTimeUntilEndOfDayInSeconds()) , removeDataBefore50thDay ,fetchStockInfo) // refreshing data
router.get('/stock-by-date/:date' , cacheMiddleware(60 * 60 * 24 * 5) , validateDateFormat ,getStockByDate);  // checked
router.get('/top10stocks',cacheMiddleware(getTimeUntilEndOfDayInSeconds()) , getTop10Stocks);  // checked
router.get('/stock-by-name/:name', cacheMiddleware(getTimeUntilEndOfDayInSeconds()),  getStockByName); // checked
router.get('/stock-history/:code',validateStockCode,cacheMiddleware(60 * 60 * 24 * 5), getStockHistory); // checked
router.post('/post-favorite/:code',validateStockCode, postFavorite ); //checked 
router.get('/favorites', cacheMiddleware() ,getFavorites); // checked
router.delete('/delete-favorite/:code', validateStockCode, deleteFavorite); // checked


export default router;