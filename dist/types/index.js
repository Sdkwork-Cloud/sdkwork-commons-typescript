"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIPromise = void 0;
class APIPromise {
    constructor(client, promise) {
        this.client = client;
        this[_a] = 'APIPromise';
        this.promise = promise;
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
    // Additional methods to make it compatible with the extended functionality
    asResponse() {
        return this.promise;
    }
}
exports.APIPromise = APIPromise;
_a = Symbol.toStringTag;
