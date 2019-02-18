# radicha apllication server side

## use
- Node.js
- express
- socket.io
- mongodb
- mongoose

### schema
```js
// users(name is unique)
{ id: socket.id, name: 'hoge' }

// messages
{ room: 'general', user: 'hoge', text: 'piyopiyo no hoge' }
```