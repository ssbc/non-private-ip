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
      if(!e.internal && filter(e.address))
          return e.address
    }
  }
}

module.exports.private = function (inter) {
  return module.exports(inter, isPrivate)
}

if(!module.parent) {
  var h = module.exports()
  if(!h) {
    console.error('no non-private address')
    console.error('private:', module.exports.private())
    process.exit(1)
  }
  console.log(h)
}
