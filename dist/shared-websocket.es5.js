/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
//# sourceMappingURL=utils.js.map

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
var SharedWebsocket = /** @class */ (function () {
    function SharedWebsocket(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this._onclose = function () { return undefined; };
        this._onerror = function () { return undefined; };
        this._onmessage = function () { return undefined; };
        this._onopen = function () { return undefined; };
        this.WEBSOCKET_COMMUNICATION_KEY = 'WEBSOCKET_COMMUNICATION_KEY';
        this.WEBSOCKET_MASTER_KEY = 'WEBSOCKET_MASTER_KEY';
        this.isMaster = false;
        this._isMasterAlive = false;
        this.destroyed = false;
        // fight for master
        this.alone = true;
        this.uuid = uuidv4();
        this.setEvents();
        this.setUp();
    }
    SharedWebsocket.prototype.send = function (data) {
        if (this.destroyed) {
            throw new Error('SharedWebsocket is closed');
        }
        else if (this.isMaster) {
            this._websocket.send(data);
        }
        else {
            var msg = {
                type: 'send_websocket',
                data: data
            };
            this.broadcast(msg);
        }
    };
    SharedWebsocket.prototype.close = function () {
        this.destroyed = true;
        if (this.isMaster) {
            this._websocket.close();
        }
        else {
            var msg = {
                type: 'close_websocket'
            };
            this.broadcast(msg);
        }
    };
    SharedWebsocket.prototype.setUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isMasterAlive, iWillBeMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.destroyed) {
                            throw new Error('SharedWebsocket is closed');
                        }
                        return [4 /*yield*/, this.isMasterAlive()];
                    case 1:
                        isMasterAlive = _a.sent();
                        if (isMasterAlive) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fightToBeMaster()];
                    case 2:
                        iWillBeMaster = _a.sent();
                        if (iWillBeMaster) {
                            return [2 /*return*/, this.setMaster()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SharedWebsocket.prototype.fightToBeMaster = function () {
        return __awaiter(this, void 0, void 0, function () {
            var willYou, firstRun, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        localStorage.setItem('WANT_TO_BE_MASTER', this.uuid);
                        willYou = true;
                        firstRun = true;
                        _b.label = 1;
                    case 1:
                        if (!(!this.alone || firstRun)) return [3 /*break*/, 7];
                        firstRun = false;
                        _a = willYou;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                return setTimeout(function () {
                                    var who = localStorage.getItem('WANT_TO_BE_MASTER');
                                    resolve(who === _this.uuid);
                                }, 50);
                            })];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        willYou = _a;
                        if (!willYou) return [3 /*break*/, 5];
                        this.alone = true;
                        this.broadcast({
                            type: 'want_to_be_master'
                        });
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 150); })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, willYou];
                }
            });
        });
    };
    SharedWebsocket.prototype.setEvents = function () {
        window.addEventListener('storage', this.handleStorageEvents.bind(this));
        window.addEventListener('beforeunload', this.destroy.bind(this));
    };
    SharedWebsocket.prototype.handleStorageEvents = function (event) {
        if (!event.newValue)
            return;
        try {
            switch (event.key) {
                case this.WEBSOCKET_COMMUNICATION_KEY:
                    this.handleCommunication(JSON.parse(event.newValue));
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    SharedWebsocket.prototype.answerIsMasterAlive = function () {
        var msg = {
            type: 'answer_is_master_alive'
        };
        this.broadcast(msg);
    };
    SharedWebsocket.prototype.handleCommunication = function (msg) {
        switch (msg.type) {
            case 'is_master_alive':
                if (msg.uuid === this.uuid) {
                    this.answerIsMasterAlive();
                }
                break;
            case 'answer_is_master_alive':
                this._isMasterAlive = true;
                break;
            case 'send_websocket':
                if (this.isMaster) {
                    this._websocket.send(msg.data);
                }
                break;
            case 'close_websocket':
                if (this.isMaster) {
                    this._websocket.close();
                }
                break;
            case 'onclose':
                if (!this.isMaster) {
                    this.onclose();
                }
                break;
            case 'onopen':
                if (!this.isMaster) {
                    this.onopen();
                }
                break;
            case 'websocket_onmessage':
                this._onmessage(msg.msg);
                break;
            case 'want_to_be_master':
                this.alone = false;
                break;
            case 'master_left':
                setTimeout(this.setUp.bind(this), 100);
                break;
            default:
                break;
        }
    };
    SharedWebsocket.prototype.destroy = function () {
        if (this.isMaster) {
            this.isMaster = false;
            localStorage.removeItem(this.WEBSOCKET_MASTER_KEY);
            var msg = {
                type: 'master_left'
            };
            this.broadcast(msg);
        }
    };
    SharedWebsocket.prototype.broadcast = function (msg) {
        localStorage.setItem(this.WEBSOCKET_COMMUNICATION_KEY, JSON.stringify(msg));
        localStorage.removeItem(this.WEBSOCKET_COMMUNICATION_KEY);
    };
    SharedWebsocket.prototype.isMasterAlive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._isMasterAlive = false;
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var currentMaster, msg;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    currentMaster = localStorage.getItem(this.WEBSOCKET_MASTER_KEY);
                                    msg = {
                                        type: 'is_master_alive',
                                        uuid: currentMaster
                                    };
                                    this.broadcast(msg);
                                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 150); })];
                                case 1:
                                    _a.sent();
                                    resolve(this._isMasterAlive);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    SharedWebsocket.prototype.setMaster = function () {
        localStorage.setItem(this.WEBSOCKET_MASTER_KEY, this.uuid);
        this.isMaster = true;
        this._websocket = new WebSocket(this.url, this.protocols);
        this._websocket.onclose = this.onclose;
        this._websocket.onerror = this.onerror;
        this._websocket.onmessage = this.onmessage;
        this._websocket.onopen = this.onopen;
    };
    Object.defineProperty(SharedWebsocket.prototype, "onclose", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.isMaster) {
                    _this.destroy();
                    _this.broadcast({ type: 'onclose' });
                }
                return _this._onclose(_this.isMaster);
            };
        },
        set: function (fn) {
            this._onclose = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharedWebsocket.prototype, "onerror", {
        get: function () {
            return this._onerror;
        },
        set: function (fn) {
            this._onerror = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharedWebsocket.prototype, "onmessage", {
        get: function () {
            var _this = this;
            return function (msg) {
                msg.isMaster = _this.isMaster;
                _this._onmessage(msg);
                if (_this.isMaster) {
                    _this.broadcast({
                        type: 'websocket_onmessage',
                        msg: {
                            data: msg.data,
                            isMaster: false
                        }
                    });
                }
            };
        },
        set: function (fn) {
            this._onmessage = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharedWebsocket.prototype, "onopen", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.isMaster) {
                    _this.broadcast({ type: 'onopen' });
                }
                return _this._onopen(_this.isMaster);
            };
        },
        set: function (fn) {
            this._onopen = fn;
        },
        enumerable: true,
        configurable: true
    });
    return SharedWebsocket;
}());
window.SharedWebsocket = SharedWebsocket;
//# sourceMappingURL=shared-websocket.js.map

export default SharedWebsocket;
//# sourceMappingURL=shared-websocket.es5.js.map
