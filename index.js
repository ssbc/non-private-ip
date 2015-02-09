var os = require('os')
var ip = require('ip')
//pick the first reasonable looking host.
//this should *just work* when running on a vps.

var isPrivate = ip.isPrivate

function isNonPrivate (e) {
  return !isPrivate(e)
}


module.exports = function (inter, filter) {
  inter = inter || os.networkInterfaces()
  filter = filter || isNonPrivate
  for(var k in inter) {
    for(var i in inter[k]) {
      var e = inter[k][i]
      // find a reasonable looking address
      if(!e.internal && filter(e.address, e))
          return e.address
      else
        console.error(e)
    }
  }
}

module.exports.private = function (inter) {
  return module.exports(inter, isPrivate)
}

module.exports.v4 = module.exports(null, function (addr, e) {
  return e.family === 'IPv4' && isNonPrivate(addr)
})

module.exports.v6 = module.exports(null, function (addr, e) {
  return e.family === 'IPv6' && isNonPrivate(addr)
})


if(!module.parent) {
  var h = module.exports()
  if(!h) {
    console.error('no non-private address')
    console.error('private:', module.exports.private())
    process.exit(1)
  }
  console.log(h)
}
