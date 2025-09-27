import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        sku: { type: String, required: true },
        brand: { type : String, required: true},
        categories: { type: [String], required: true},
        variant: { type: String, required: true },
        affiliation: {type: String},
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// This creates a TTL index on the 'createdAt' field.
//Documents will be automatically deleted 432000 seconds (5days) after creation
orderSchema.index({ createdAt: 1}, { expireAfterSeconds: 432000 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
