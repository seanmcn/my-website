module.exports = function(api) {
  api.cache(true); // Enable caching and cache the returned value forever.
  return {
    plugins: ['macros'],
  };
};
