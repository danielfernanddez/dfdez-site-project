import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    
    // An array for multiple image URLs (main image, thumbnails, etc.)
    images: { type: [String], required: true },

    categories: { type: [String], required: true },
    
    // Structured data for color options
    colorVariants: [
      {
        name: { type: String, required: true }, // e.g., "BISON BLACK"
        hex: { type: String, required: true },  // e.g., "#343438"
      }
    ],

    // An array of available sizes
    availableSizes: { type: [String], required: true },

    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number }, // The sale price, if applicable
    currency: { type: String, required: true, default: 'EUR' },
    
    // Fields for ratings, as seen on the product cards
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    
    countInStock: { type: Number, required: true, default: 0 },
    affiliation: { type: String, default: 'Online Store' },

    // Detailed fields for the accordion sections
    editorNotes: { type: String},
    sizeAndFit: { type: String },
    compositionAndCare: { type: String },

  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
