# 🚀 DFDEZ Store - An E-commerce Analytics Sandbox

Welcome to the DFDEZ Store! This isn't your average e-commerce site. It was built from the ground up as a comprehensive, real-world sandbox for testing and mastering web analytics implementations. While it functions as a full-stack MERN application, its primary purpose is to serve as a playground for deploying and validating tracking setups with Google Tag Manager, GA4, and more.

The entire project was guided and co-developed with the help of Google's Gemini 2.5 PRO.

---

## 🛠️ Tech Stack

This project is a full-stack application built with modern technologies.

**Frontend:**
* **React**: For building the user interface.
* **Vite**: As the lightning-fast build tool and dev server.
* **React Router**: For client-side routing in this SPA.
* **Axios**: For making API calls to the backend.
* **React Context**: For global state management (User Auth, Cart, Wishlist).

**Backend:**
* **Node.js**: As the JavaScript runtime.
* **Express**: As the web server framework.
* **MongoDB Atlas**: As the NoSQL database for storing products, users, and orders.
* **Mongoose**: As the ODM for interacting with MongoDB.
* **JWT (JSON Web Tokens)**: For user authentication.

**Analytics & Tracking:**
* **Google Tag Manager (GTM)**: The central hub for all tracking tags.
* **Google Analytics 4 (GA4)**: The destination for all analytics data.
* **DataLayer - GA4 Enhanced Ecommerce Structure**: A rich, GA4-compliant dataLayer for e-commerce and custom events.

---

## ✨ Features

While it looks like a standard e-commerce store, the real features are in the analytics implementation.

### E-commerce Functionality
* **Product Listings**: Separate pages for regular products and sale items.
* **Product Detail Pages**: Dynamic pages for each item with image galleries and product options.
* **Shopping Cart**: Full add/remove/view cart functionality.
* **Wishlist**: Users can add and remove favorite items.
* **Multi-Step Checkout Funnel**: A complete checkout process from login to a thank-you page.
* **User Authentication**: Users can create an account, log in, and view their order history.

### Analytics Implementation (The Main Event!)
* **Robust Data Layer**: A comprehensive, GA4-compliant data layer that tracks the entire user journey.
* **Complete E-commerce Funnel Tracking**:
    * `view_item_list`
    * `select_item`
    * `view_item`
    * `add_to_cart`
    * `view_cart`
    * `remove_from_cart`
    * `add_to_wishlist`
    * `remove_from_wishlist`
    * `begin_checkout`
    * `add_shipping_info`
    * `add_payment_info`
    * `purchase` (with tax, shipping, and pre-discount subtotals)
* **User & Lead Generation Tracking**:
    * `login` & `sign_up` events with hashed user data.
    * `generate_lead` for the contact form.
    * `newsletter_subscription` for the newsletter form.
    * `form_start` and `form_submit_error` to analyze "Contact Us" form funnel.
* **Promotion Tracking**:
    * `view_promotion`.
    * `select_promotion`.
* **SPA Page View Tracking**: A custom `spa_page_view` event for tracking virtual page views in this React SPA.
* **User Scope Data**: The `user_id` and `user_status` ('logged_in' or 'Guest User') are sent with all relevant events.

---

This project was built to test, learn, and break things. If you found it, feel free to clone it and use it for your own analytics experiments by injecting yout GTM snippet! Happy tracking! 🤓
