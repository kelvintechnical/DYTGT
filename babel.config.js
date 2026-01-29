module.exports = function (api) {
  api.cache(true);
  const plugins = [];
  if (!process.env.JEST_WORKER_ID) {
    plugins.push(['module:react-native-dotenv']);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
