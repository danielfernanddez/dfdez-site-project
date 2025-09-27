/**
 * Pushes a payload to the dataLayer.
 * Initializes the dataLayer if it doesn't exist.
 * @param {object} payload - The data to push to the dataLayer.
 */
export const pushDataLayer = (payload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};
