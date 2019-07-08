// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { uuidv4 } from './utils'

interface SharedWebsocketMessageEvent extends MessageEvent {
    isMaster: boolean
}

export default class SharedWebsocket {
    private _onclose: Function = () => undefined
    private _onerror: Function = () => undefined
    private _onmessage: Function = () => undefined
    private _onopen: Function = () => undefined

    private WEBSOCKET_COMMUNICATION_KEY = 'WEBSOCKET_COMMUNICATION_KEY'
    private WEBSOCKET_MASTER_KEY = 'WEBSOCKET_MASTER_KEY'

    private isMaster: boolean = false
    private _isMasterAlive: boolean = false
    private uuid: string
    private _websocket: WebSocket | any
    private destroyed = false

    // fight for master
    private alone: boolean = true

    constructor(public url: string, public protocols?: string[]) {
        this.uuid = uuidv4()
        this.setEvents()
        this.setUp()
    }

    send(data: any) {
        if (this.destroyed) {
            throw new Error('SharedWebsocket is closed')
        } else if (this.isMaster) {
            this._websocket.send(data)
        } else {
            const msg = {
                type: 'send_websocket',
                data
            }
            this.broadcast(msg)
        }
    }

    close() {
        this.destroyed = true
        if (this.isMaster) {
            this._websocket.close()
        } else {
            const msg = {
                type: 'close_websocket'
            }
            this.broadcast(msg)
        }
    }

    async setUp(): Promise<void> {
        if (this.destroyed) {
            throw new Error('SharedWebsocket is closed')
        }
        const isMasterAlive = await this.isMasterAlive()
        if (isMasterAlive) {
            return
        }

        let iWillBeMaster = await this.fightToBeMaster()

        if (iWillBeMaster) {
            return this.setMaster()
        }
    }

    async fightToBeMaster(): Promise<boolean> {
        localStorage.setItem('WANT_TO_BE_MASTER', this.uuid)
        let willYou = true
        let firstRun = true

        while (!this.alone || firstRun) {
            firstRun = false
            willYou =
                willYou &&
                (await new Promise(resolve =>
                    setTimeout(() => {
                        const who = localStorage.getItem('WANT_TO_BE_MASTER')
                        resolve(who === this.uuid)
                    }, 50)
                ))
            if (willYou) {
                this.alone = true
                this.broadcast({
                    type: 'want_to_be_master'
                })
                await new Promise(resolve => setTimeout(resolve, 150))
            } else {
                break
            }
        }
        return willYou
    }

    setEvents() {
        window.addEventListener('storage', this.handleStorageEvents.bind(this))
        window.addEventListener('beforeunload', this.destroy.bind(this))
    }

    handleStorageEvents(event: any) {
        if (!event.newValue) return
        try {
            switch (event.key) {
                case this.WEBSOCKET_COMMUNICATION_KEY:
                    this.handleCommunication(JSON.parse(event.newValue))
                    break
                default:
                    break
            }
        } catch (error) {
            console.log(error)
        }
    }

    answerIsMasterAlive() {
        const msg = {
            type: 'answer_is_master_alive'
        }
        this.broadcast(msg)
    }

    handleCommunication(msg: object | any) {
        switch (msg.type) {
            case 'is_master_alive':
                if (msg.uuid === this.uuid) {
                    this.answerIsMasterAlive()
                }
                break

            case 'answer_is_master_alive':
                this._isMasterAlive = true
                break

            case 'send_websocket':
                if (this.isMaster) {
                    this._websocket.send(msg.data)
                }
                break

            case 'close_websocket':
                if (this.isMaster) {
                    this._websocket.close()
                }
                break

            case 'onclose':
                if (!this.isMaster) {
                    this.onclose()
                }
                break

            case 'onopen':
                if (!this.isMaster) {
                    this.onopen()
                }
                break

            case 'websocket_onmessage':
                this._onmessage(msg.msg)
                break

            case 'want_to_be_master':
                this.alone = false
                break

            case 'master_left':
                setTimeout(this.setUp.bind(this), 100)
                break

            default:
                break
        }
    }

    destroy() {
        if (this.isMaster) {
            this.isMaster = false
            localStorage.removeItem(this.WEBSOCKET_MASTER_KEY)
            const msg = {
                type: 'master_left'
            }
            this.broadcast(msg)
        }
    }

    broadcast(msg: object) {
        localStorage.setItem(this.WEBSOCKET_COMMUNICATION_KEY, JSON.stringify(msg))
        localStorage.removeItem(this.WEBSOCKET_COMMUNICATION_KEY)
    }

    async isMasterAlive(): Promise<boolean> {
        this._isMasterAlive = false
        return new Promise(async resolve => {
            const currentMaster = localStorage.getItem(this.WEBSOCKET_MASTER_KEY)
            const msg = {
                type: 'is_master_alive',
                uuid: currentMaster
            }
            this.broadcast(msg)
            await new Promise(r => setTimeout(r, 150))
            resolve(this._isMasterAlive)
        })
    }

    setMaster(): void {
        localStorage.setItem(this.WEBSOCKET_MASTER_KEY, this.uuid)
        this.isMaster = true
        this._websocket = new WebSocket(this.url, this.protocols)
        this._websocket.onclose = this.onclose
        this._websocket.onerror = this.onerror
        this._websocket.onmessage = this.onmessage
        this._websocket.onopen = this.onopen
    }

    get onclose(): Function {
        return () => {
            if (this.isMaster) {
                this.destroy()
                this.broadcast({ type: 'onclose' })
            }
            return this._onclose(this.isMaster)
        }
    }
    set onclose(fn: Function) {
        this._onclose = fn
    }

    get onerror(): Function {
        return this._onerror
    }
    set onerror(fn: Function) {
        this._onerror = fn
    }

    get onmessage(): Function {
        return (msg: SharedWebsocketMessageEvent) => {
            msg.isMaster = this.isMaster
            this._onmessage(msg)
            if (this.isMaster) {
                this.broadcast({
                    type: 'websocket_onmessage',
                    msg: {
                        data: msg.data,
                        isMaster: false
                    }
                })
            }
        }
    }
    set onmessage(fn: Function) {
        this._onmessage = fn
    }

    get onopen(): Function {
        return () => {
            if (this.isMaster) {
                this.broadcast({ type: 'onopen' })
            }
            return this._onopen(this.isMaster)
        }
    }
    set onopen(fn: Function) {
        this._onopen = fn
    }
}

declare global {
    interface Window {
        SharedWebsocket: any
    }
}

window.SharedWebsocket = SharedWebsocket
