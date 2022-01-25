# non-private-ip

Picks the first reasonable looking IP address from network interfaces.
This should *just work* when running on a VPS, but also provides `private` APIs
so that when running in LAN you get the first reasonable looking LAN IP address.

More info: http://en.wikipedia.org/wiki/Private_network

Your laptop probably does not have a non-local IP address, but your VPS server
probably does. This just returns the first address, which will probably be IPv4.

This module is based on the ["ip" module](https://www.npmjs.com/package/ip).

## API

```js
// On a VPS:
const nonPrivateIP = require('non-private-ip')
nonPrivateIP() // 80.78.25.153
```

```js
// In a LAN:
const nonPrivateIP = require('non-private-ip')
nonPrivateIP.private() // 192.168.0.101
```

## License

MIT
