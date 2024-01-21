
import Favorite from "../models/Favorite.js";

const findOneAndDelete = async (filter) => {
    try{
        return await Favorite.findOneAndDelete(filter);
    }
    catch(error){
        console.error('Error deleting favorite:', error);
        throw error;
    }
}


const deleteFavorite = async (req, res) => {
    const { code } = req.params; // Assuming you pass the ID of the favorite stock to delete
  
    try {
      // Find the favorite stock by ID and remove it
      const deletedFavorite = await findOneAndDelete({ SC_CODE: code });
  
      if (!deletedFavorite) {
        return res.status(404).json({ error: 'Favorite stock not found' });
      }
  
      return res.json({ success: true, message: 'Stock removed from favorites' });
    } catch (error) {
      console.error('Error removing stock from favorites:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  export default deleteFavorite;