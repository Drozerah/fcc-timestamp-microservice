var dns = require('dns')

const dnsLookup = _url => {
  return new Promise((resolve, reject) => {
    let url = new URL({ toString: () => _url })
    // check hostname validity from valid url
    if (url.hostname) {
      url = url.hostname
      dns.lookup(url, (err, addresses, family) => {
        if (err) { // error hostname is invalid - return boolean false
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(false)
        } else { // resolved hostname is valid - return boolean true
          return resolve(true)
        }
      })
    } else {
      // hostname is invalid from valid url - return boolean false
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject(false)
    }
  })
}

module.exports = dnsLookup
