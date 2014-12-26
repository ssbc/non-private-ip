var os = require('os')
var ip = require('ip')
//pick the first reasonable looking host.
//this should *just work* when running on a vps.


module.exports = function (inter) {
  inter = inter || os.networkInterfaces()
  for(var k in inter) {
    for(var i in inter[k]) {
      var e = inter[k][i]
      // find a reasonable looking address
      if(!e.internal && !ip.isPrivate(e.address, e))
          return e.address
    }
  }
}

if(!module.parent) {
  var h = module.exports()
  if(!h) {
    console.error('no non-private address')
    process.exit(1)
  }
  console.log(h)
}
