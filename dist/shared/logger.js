"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static info(message, meta) {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
    }
    static error(message, meta) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || '');
    }
    static warn(message, meta) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
    }
}
exports.Logger = Logger;
