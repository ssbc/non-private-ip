#! /usr/bin/env node
var os = require('os')
var ip = require('ip')
//pick the first reasonable looking host.
//this should *just work* when running on a vps.

var isPrivate = ip.isPrivate

function isNonPrivate (e) {
  return !isPrivate(e)
}


var address = module.exports = function (inter, filter) {
  inter = inter || os.networkInterfaces()
  filter = filter || isNonPrivate
  for(var k in inter) {
    for(var i in inter[k]) {
      var e = inter[k][i]
      // find a reasonable looking address
      if(!e.internal && filter(e.address, e))
          return e.address
    }
  }
}

function isV4 (e) {
  return e.family === 'IPv4'
}

function isV6 (e) {
  return e.family === 'IPv6'
}

var _private = module.exports.private = function (inter) {
  return address(inter, isPrivate)
}

module.exports.v4 = address(null, function (addr, e) {
  return isV4(e) && isNonPrivate(addr)
})

module.exports.v6 = address(null, function (addr, e) {
  return isV6(e) && isNonPrivate(addr)
})

_private.v4 = address(null, function (addr, e) {
  return isV4(e) && isPrivate(addr)
})

_private.v6 = address(null, function (addr, e) {
  return isV6(e) && isPrivate(addr)
})

module.exports.all = {
  public: {
    v4: module.exports.v4, v6: module.exports.v6
  },
  private: {
    v4: _private.v4, v6: _private.v6
  }
}


if(!module.parent) {
  console.log(module.exports.all)
}
