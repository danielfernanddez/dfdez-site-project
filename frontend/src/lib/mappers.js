/**
 * Maps a product object from the backend API to a GA4 Item object.
 * This function handles the core, static properties of a product.
 * Contextual properties like 'quantity' or 'item_variant' should be added
 * at the time of the event push (e.g., in the component).
 *
 * @param {object} product - The product object from MongoDB.
 * @returns {object} A GA4-compliant item object.
 */
export const mapProductToGA4 = (product) => {
  if (!product) return {};

  const ga4Item = {
    item_id: product.sku,
    item_name: product.name,
    item_brand: product.brand,
    affiliation: product.affiliation,
    price: product.price,
    currency: product.currency,
    discount: 0,
  };

  // Dynamically map up to 5 categories from the categories array
  if (product.categories && Array.isArray(product.categories)) {
    product.categories.slice(0, 5).forEach((category, index) => {
      // The first category is 'item_category', the second is 'item_category2', etc.
      const key = `item_category${index === 0 ? '' : index + 1}`;
      ga4Item[key] = category;
    });
  }
  
  // If there's a discountPrice, calculate and add the 'discount' field
  if (product.discountPrice && product.discountPrice < product.price) {
    // The GA4 'price' should be the discounted price, and 'discount' the amount saved
    ga4Item.price = product.discountPrice; 
    ga4Item.discount = parseFloat((product.price - product.discountPrice).toFixed(2));
  }

  return ga4Item;
};
