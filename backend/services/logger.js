class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance; // run instance
        }
        Logger.instance = this; // save instance
    }

    log(message) {
        console.log(`${new Date().toLocaleString()} [LOG] ${message}`);
    }

    error(message) {
        console.error(`${new Date().toLocaleString()} [ERROR] ${message}`);
    }
}

module.exports = new Logger();