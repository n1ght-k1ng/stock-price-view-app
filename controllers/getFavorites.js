// import { Favorite } from '../models/Favorite';
import Favorite from "../models/Favorite.js";
const getFavorites = async (req, res) => {
    try {
      // Fetch all favorite stocks from the Favorite collection
      const favoriteStocks = await Favorite.find();
  
      return res.json(favoriteStocks);
    } catch (error) {
      console.error('Error fetching favorite stocks:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    export default getFavorites;