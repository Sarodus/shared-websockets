Shared websockets
-----------------

Share same WebSocket between tabs, similar API to native WebSocket

Usage:

```
const socket = new SharedWebsocket('wss://echo.websocket.org')
socket.onmessage = msg => {
    console.log(`Got message from ${msg.isMaster ? "master" : "slave"}!`, msg)
}
socket.onerror = console.log
socket.onclose = (isMaster) => console.log('CLOSED!', isMaster)
socket.onopen = (isMaster) => console.log('OPENED!', isMaster)
```
