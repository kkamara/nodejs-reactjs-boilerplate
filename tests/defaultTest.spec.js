module.exports = {
  '@tags': ['beta'],
  'NW test on Google' : function (client) {
    client
      .useXpath()
      .url('http://www.google.com')
      .assert.title('Google')
      .pause(5000)
      .end()
  }
}
