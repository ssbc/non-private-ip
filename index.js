const os = require('os')
const ip = require('ip')
// pick the first reasonable looking host.
// this should *just work* when running on a vps.

const isPrivate = ip.isPrivate

function isNonPrivate(e) {
  return !isPrivate(e)
}

const address = (module.exports = function address(inter, filter) {
  inter = inter || os.networkInterfaces()
  filter = filter || isNonPrivate
  let score = 0
  let candidate = undefined
  for (const k of Object.keys(inter)) {
    for (const e of inter[k]) {
      // Must not be loopback:
      if (e.internal) continue
      // Must pass our filter:
      if (!filter(e.address, e)) continue

      // Prioritize IPv4 wlan:
      if (k.startsWith('wl') && e.family === 'IPv4' && score < 8) {
        score = 8
        candidate = e.address
      }
      // Prioritize IPv4 ethernet:
      else if (k.startsWith('en') && e.family === 'IPv4' && score < 7) {
        score = 7
        candidate = e.address
      }
      // Prioritize IPv4 OLD ethernet:
      else if (k.startsWith('eth') && e.family === 'IPv4' && score < 6) {
        score = 6
        candidate = e.address
      }
      // Prioritize wlan:
      else if (k.startsWith('wl') && e.family === 'IPv6' && score < 5) {
        score = 5
        candidate = e.address + '%' + k
      }
      // Prioritize ethernet:
      else if (k.startsWith('en') && e.family === 'IPv6' && score < 4) {
        score = 4
        candidate = e.address + '%' + k
      }
      // Prioritize OLD ethernet:
      else if (k.startsWith('eth') && e.family === 'IPv6' && score < 3) {
        score = 3
        candidate = e.address + '%' + k
      }
      // Prioritize IPv4 tunnels (VPN):
      else if (k.startsWith('tun') && e.family === 'IPv4' && score < 2) {
        score = 2
        candidate = e.address
      }
      // Prioritize tunnels (VPN):
      else if (k.startsWith('tun') && e.family === 'IPv6' && score < 1) {
        score = 1
        candidate = e.address + '%' + k
      }
    }
  }
  return candidate
})

function isV4(e) {
  return e.family === 'IPv4'
}

function isV6(e) {
  return e.family === 'IPv6'
}

const _private = (module.exports.private = function _private(inter) {
  return address(inter, isPrivate)
})

module.exports.v4 = address(null, function v4(addr, e) {
  return isV4(e) && isNonPrivate(addr)
})

module.exports.v6 = address(null, function v6(addr, e) {
  return isV6(e) && isNonPrivate(addr)
})

_private.v4 = address(null, function privateV4(addr, e) {
  return isV4(e) && isPrivate(addr)
})

_private.v6 = address(null, function privateV6(addr, e) {
  return isV6(e) && isPrivate(addr)
})

module.exports.all = {
  public: {
    v4: module.exports.v4,
    v6: module.exports.v6,
  },
  private: {
    v4: _private.v4,
    v6: _private.v6,
  },
}
