// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.NO_PROXY = 'localhost, 0.0.0.0/4201, 0.0.0.0/9876'; process.env.no_proxy = 'localhost, 0.0.0.0/4201, 0.0.0.0/9876';
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    browsers: ['ChromeNoSandbox'],
    customLaunchers: {
        ChromeNoSandbox: {
            base: 'Chrome',
            flags: [
              '--headless',
              '--no-sandbox',
              '--disable-gpu',
              '--crash-dumps-dir=/Users/evan/Documents/tmp',
              '--user-data-dir=/Users/evan/Documents/data',
              '--remote-debugging-port=9876'
            ]
        }
    },
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/finticks-demo'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  });
};
