class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance; // run instance
    }
    Logger.instance = this; // save instance
  }

  log(message) {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}

module.exports = new Logger();