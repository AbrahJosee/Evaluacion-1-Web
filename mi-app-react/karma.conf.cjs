module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [{ pattern: 'src/test/**/*.spec.@(js|jsx)', watched: false }],
    preprocessors: {
      'src/test/**/*.spec.@(js|jsx)': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [
                  [
                    'istanbul',
                    {
                      include: ['src/**/*.js', 'src/**/*.jsx'],
                      exclude: ['src/test/**', 'src/main.jsx', 'src/admin/main.jsx'],
                    },
                  ],
                ],
              },
            },
          },
          { test: /\.css$/, type: 'asset/source' },
        ],
      },
    },
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-spec-reporter',
    ],
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};
