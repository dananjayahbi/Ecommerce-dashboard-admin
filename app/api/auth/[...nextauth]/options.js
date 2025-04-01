// ...existing code...

export const options = {
  // ...existing code...
  
  // Ensure consistent JWT settings
  session: {
    strategy: "jwt",
    // Reasonable maxAge (optional)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    // Make sure we're not overriding the secret here if it exists
  },
  
  // ...existing code...
};
