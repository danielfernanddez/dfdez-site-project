const products = [
  // --- REGULAR PRODUCTS (discountPrice is empty) ---
  { name: "Athletic Half Zip", sku: "W-HZ-001", brand: "CULT", images: ["/images/products/half-zip-black.webp"], categories: ["Hoodies and Sweatshirts", "Tops"], colorVariants: [{ name: "BISON BLACK", hex: "#343438" }], availableSizes: ["6", "8", "10", "12"], price: 44.99, discountPrice: "", currency: "EUR", rating: 4.5, numReviews: 12, countInStock: 25, affiliation: "Online Store", editorNotes: "A cosy essential, with a gorgeous vintage twist.", sizeAndFit: "Loose Fit – where comfort meets cool.", compositionAndCare: "100% Cotton in conversion." },
  { name: "MA1 Military Bomber Jacket", sku: "M-JCKT-002", brand: "DFDEZ", images: ["/images/products/bomber-jacket-olive.webp"], categories: ["Apparel", "Jackets"], colorVariants: [{ name: "OLIVE GREEN", hex: "#556B2F" }], availableSizes: ["S", "M", "L", "XL"], price: 129.99, discountPrice: "", currency: "EUR", rating: 4, numReviews: 8, countInStock: 20, affiliation: "Online Store", editorNotes: "A classic military-style bomber jacket.", sizeAndFit: "Standard Fit.", compositionAndCare: "Shell:100% nylon." },
  { name: "Padded Jacket Sports", sku: "M-JCKT-003", brand: "DFDEZ", images: ["/images/products/padded-jacket-black.webp"], categories: ["Apparel", "Jackets"], colorVariants: [{ name: "BLACK", hex: "#000000" }], availableSizes: ["S", "M", "L", "XL", "XXL"], price: 149.99, discountPrice: "", currency: "EUR", rating: 5, numReviews: 22, countInStock: 18, affiliation: "Online Store", editorNotes: "Stay warm with this premium padded jacket.", sizeAndFit: "Regular Fit.", compositionAndCare: "Padding:100% recycled polyester." },
  { name: "Classic Cotton T-Shirt", sku: "U-TS-010", brand: "CULT", images: ["/images/products/tshirt-white.webp"], categories: ["T-Shirts", "Tops"], colorVariants: [{ name: "OPTIC WHITE", hex: "#FFFFFF" }], availableSizes: ["XS", "S", "M", "L", "XL"], price: 29.99, discountPrice: "", currency: "EUR", rating: 4.8, numReviews: 45, countInStock: 150, affiliation: "Online Store", editorNotes: "The perfect everyday essential.", sizeAndFit: "Slim Fit.", compositionAndCare: "100% Organic Cotton." },
  { name: "Vintage Logo Hoodie", sku: "U-HD-004", brand: "DFDEZ", images: ["/images/products/hoodie-grey.webp"], categories: ["Hoodies", "Tops"], colorVariants: [{ name: "GREY MARL", hex: "#B2BEB5" }], availableSizes: ["S", "M", "L"], price: 79.99, discountPrice: "", currency: "EUR", rating: 4.9, numReviews: 31, countInStock: 40, affiliation: "Online Store", editorNotes: "A super-soft hoodie with our iconic vintage logo.", sizeAndFit: "Oversized Fit.", compositionAndCare: "80% Cotton, 20% Polyester." },
  { name: "Cargo Trousers", sku: "M-TRS-007", brand: "DFDEZ", images: ["/images/products/cargo-trousers-khaki.webp"], categories: ["Trousers"], colorVariants: [{ name: "KHAKI", hex: "#8F9779" }], availableSizes: ["30", "32", "34", "36"], price: 89.99, discountPrice: "", currency: "EUR", rating: 4.2, numReviews: 15, countInStock: 35, affiliation: "Online Store", editorNotes: "Durable and practical cargo trousers.", sizeAndFit: "Relaxed Fit.", compositionAndCare: "100% Cotton." },
  { name: "Essentials Crewneck", sku: "W-SW-008", brand: "CULT", images: ["/images/products/sweatshirt-dusty-rose.webp"], categories: ["Sweatshirts", "Tops"], colorVariants: [{ name: "DUSTY ROSE", hex: "#DCAE96" }], availableSizes: ["6", "8", "10", "12"], price: 59.99, discountPrice: "", currency: "EUR", rating: 4.6, numReviews: 25, countInStock: 60, affiliation: "Online Store", editorNotes: "A timeless crew neck sweatshirt.", sizeAndFit: "Standard Fit.", compositionAndCare: "100% Cotton." },
  { name: "Quilted Gilet with Hood", sku: "M-GLT-001", brand: "DFDEZ", images: ["/images/products/gilet-navy.webp"], categories: ["Gilets", "Jackets"], colorVariants: [{ name: "RICH NAVY", hex: "#000080" }], availableSizes: ["S", "M", "L", "XL"], price: 99.99, discountPrice: "", currency: "EUR", rating: 4.7, numReviews: 19, countInStock: 22, affiliation: "Online Store", editorNotes: "The perfect layering piece.", sizeAndFit: "Standard Fit.", compositionAndCare: "Padding: 100% recycled materials." },
  { name: "Organic Cotton Chinos", sku: "M-CHN-011", brand: "CULT", images: ["/images/products/chinos-sand.webp"], categories: ["Trousers"], colorVariants: [{ name: "SAND", hex: "#C2B280" }], availableSizes: ["30/32", "32/32", "34/32"], price: 74.99, discountPrice: "", currency: "EUR", rating: 4.6, numReviews: 28, countInStock: 45, affiliation: "Online Store", editorNotes: "A modern wardrobe staple.", sizeAndFit: "Slim Fit.", compositionAndCare: "98% Organic Cotton, 2% Elastane." },
  { name: "Classic Leather Biker Jacket", sku: "W-JCKT-015", brand: "DFDEZ", images: ["/images/products/biker-jacket-black.webp"], categories: ["Jackets"], colorVariants: [{ name: "BLACK", hex: "#000000" }], availableSizes: ["8", "10", "12", "14"], price: 249.99, discountPrice: "", currency: "EUR", rating: 5.0, numReviews: 18, countInStock: 12, affiliation: "Online Store", editorNotes: "Invest in a timeless classic.", sizeAndFit: "Regular Fit.", compositionAndCare: "100% Lambskin Leather." },
  { name: "Linen-Cotton Blend Shirt", sku: "M-SHRT-021", brand: "CULT", images: ["/images/products/linen-shirt-blue.webp"], categories: ["Shirts", "Tops"], colorVariants: [{ name: "SKY BLUE", hex: "#87CEEB" }], availableSizes: ["S", "M", "L", "XL"], price: 64.99, discountPrice: "", currency: "EUR", rating: 4.3, numReviews: 21, countInStock: 55, affiliation: "Online Store", editorNotes: "Stay cool and comfortable.", sizeAndFit: "Tailored Fit.", compositionAndCare: "55% Linen, 45% Cotton." },
  { name: "High-Waisted Denim Jeans", sku: "W-JNS-005", brand: "DFDEZ", images: ["/images/products/jeans-vintage-wash.webp"], categories: ["Jeans"], colorVariants: [{ name: "VINTAGE WASH", hex: "#6F8FAF" }], availableSizes: ["26/32", "28/32", "30/32"], price: 99.99, discountPrice: "", currency: "EUR", rating: 4.8, numReviews: 35, countInStock: 30, affiliation: "Online Store", editorNotes: "Crafted for the perfect fit.", sizeAndFit: "Straight Fit.", compositionAndCare: "99% Cotton, 1% Elastane." },

  // --- NEW SALE PRODUCTS (with discountPrice) ---
  {
    name: "Graphic Print Crew T-Shirt",
    sku: "S-TS-001",
    brand: "CULT",
    images: ["/images/products/graphic-print-tshirt.webp"], // Add your new image filename here
    categories: ["T-Shirts", "Sale"],
    colorVariants: [{ name: "ACID WASH", hex: "#778899" }],
    availableSizes: ["S", "M", "L", "XL"],
    price: 39.99,
    discountPrice: 19.99,
    currency: "EUR",
    rating: 4.2,
    numReviews: 18,
    countInStock: 80,
    affiliation: "Online Store",
    editorNotes: "A bold graphic t-shirt with a unique acid wash finish.",
    sizeAndFit: "Regular Fit.",
    compositionAndCare: "100% Cotton."
  },
  {
    name: "Light Parachute Pants",
    sku: "S-TRS-002",
    brand: "DFDEZ",
    images: ["/images/products/parachute-pants.webp"], // Add your new image filename here
    categories: ["Trousers", "Sale"],
    colorVariants: [{ name: "STONE", hex: "#D2B48C" }],
    availableSizes: ["S", "M", "L"],
    price: 99.99,
    discountPrice: 49.99,
    currency: "EUR",
    rating: 4.5,
    numReviews: 25,
    countInStock: 40,
    affiliation: "Online Store",
    editorNotes: "Ultra-lightweight and stylish parachute pants for a relaxed look.",
    sizeAndFit: "Loose Fit with toggle cuffs.",
    compositionAndCare: "100% Nylon."
  },
  {
    name: "Vintage Runner Sneakers",
    sku: "S-SNK-003",
    brand: "CULT",
    images: ["/images/products/sneakers-chancla.webp"], // Add your new image filename here
    categories: ["Footwear", "Sale"],
    colorVariants: [{ name: "RETRO WHITE", hex: "#F5F5F5" }],
    availableSizes: ["41", "42", "43", "44", "45"],
    price: 119.99,
    discountPrice: 59.99,
    currency: "EUR",
    rating: 4.9,
    numReviews: 55,
    countInStock: 30,
    affiliation: "Online Store",
    editorNotes: "Classic runner sneakers with a vintage aesthetic and modern comfort.",
    sizeAndFit: "True to size.",
    compositionAndCare: "Suede and textile upper."
  },
  {
    name: "Fleece Zip Overshirt",
    sku: "S-JCKT-004",
    brand: "DFDEZ",
    images: ["/images/products/fleece-sd.webp"], // Add your new image filename here
    categories: ["Jackets", "Sale"],
    colorVariants: [{ name: "CAMO", hex: "#78866B" }],
    availableSizes: ["M", "L", "XL"],
    price: 89.99,
    discountPrice: 44.99,
    currency: "EUR",
    rating: 4.7,
    numReviews: 21,
    countInStock: 25,
    affiliation: "Online Store",
    editorNotes: "A versatile fleece overshirt with a zip-through front, perfect as a light jacket.",
    sizeAndFit: "Relaxed Fit.",
    compositionAndCare: "100% Polyester Fleece."
  },
  {
    name: "Slim Corduroy Trousers",
    sku: "S-TRS-005",
    brand: "CULT",
    images: ["/images/products/corduroy-trousers.webp"],
    categories: ["Trousers", "Sale"],
    colorVariants: [{
        name: "TAN",
        hex: "#D2B48C"
    }],
    availableSizes: ["30/32", "32/32", "34/32"],
    price: 84.99,
    discountPrice: 42.49,
    currency: "EUR",
    rating: 4.4,
    numReviews: 22,
    countInStock: 38,
    affiliation: "Online Store",
    editorNotes: "Classic corduroy trousers with a modern slim fit, perfect for smart-casual looks.",
    sizeAndFit: "Slim Fit. Cut for a sleek silhouette that sits close to the body.",
    compositionAndCare: "98% Cotton, 2% Elastane."
  },
  {
    name: "Oversized Crewneck",
    sku: "S-SW-006",
    brand: "DFDEZ",
    images: ["/images/products/oversized-crewnecks.webp"],
    categories: ["Sweatshirts", "Sale"],
    colorVariants: [{
        name: "WASHED BLACK",
        hex: "#3A3B3C"
    }],
    availableSizes: ["XS", "S", "M"],
    price: 79.99,
    discountPrice: 39.99,
    currency: "EUR",
    rating: 4.8,
    numReviews: 31,
    countInStock: 25,
    affiliation: "Online Store",
    editorNotes: "An oversized sweatshirt featuring a bold back graphic for a statement look.",
    sizeAndFit: "Oversized Fit. Exaggerated and super relaxed.",
    compositionAndCare: "100% Cotton. Machine wash cold."
  },
  {
    name: "Canvas High-Top Sneakers",
    sku: "S-SNK-007",
    brand: "CULT",
    images: ["/images/products/canvas-sneakers.webp"],
    categories: ["Footwear", "Sale"],
    colorVariants: [{
        name: "NATURAL",
        hex: "#F5F5DC"
    }],
    availableSizes: ["40", "41", "42", "43"],
    price: 79.99,
    discountPrice: 39.99,
    currency: "EUR",
    rating: 4.6,
    numReviews: 41,
    countInStock: 50,
    affiliation: "Online Store",
    editorNotes: "Durable and timeless canvas high-tops that pair with any outfit.",
    sizeAndFit: "Fits true to size.",
    compositionAndCare: "Canvas upper, rubber sole."
  },
  {
    name: "Ripstop Utility Gilet",
    sku: "S-GLT-008",
    brand: "DFDEZ",
    images: ["/images/products/utility-gilet.webp"],
    categories: ["Gilets", "Sale"],
    colorVariants: [{
        name: "DARK OLIVE",
        hex: "#556B2F"
    }],
    availableSizes: ["S", "M", "L", "XL"],
    price: 109.99,
    discountPrice: 54.99,
    currency: "EUR",
    rating: 4.9,
    numReviews: 29,
    countInStock: 18,
    affiliation: "Online Store",
    editorNotes: "A functional gilet made from durable ripstop fabric, featuring multiple utility pockets.",
    sizeAndFit: "Regular Fit, perfect for layering.",
    compositionAndCare: "100% Ripstop Cotton."
  }
];

export default products;




