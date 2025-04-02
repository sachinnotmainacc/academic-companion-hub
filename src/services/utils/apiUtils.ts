// Check if we're running in the browser
export const isBrowser = typeof window !== 'undefined';

// Generate a random ID for API operations
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
