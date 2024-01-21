import  mongoose from 'mongoose';
const { Schema } = mongoose;

const FavoriteSchema = new Schema(
  {
    SC_CODE: {
      type: String,
      required: false,
      trim: true,
    },
    SC_NAME: {
      type: String,
      required: false,
      trim: true,
    },
    OPEN: {
      type: String,
    },
    HIGH: {
      type: String,
    },
    LOW: {
      type: String,
    },
    CLOSE: {
      type: String,
    },
    LAST: {
      type: String,
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model('Favorite', FavoriteSchema);
export default Favorite;