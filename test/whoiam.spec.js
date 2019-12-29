const app = require("../app")
const request = require("supertest")
/**
* Specifications 
*/
// ? [x] I can get the IP address, language and operating system for the browser.
describe("Test API route /api/whoiam", () => {
  it("It should return the IP address, language and the operating system for the browser", (done) => {
    request(app)
      .get("/api/whoiam")
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if( response.body.ipaddress.length > 0 && 
            response.body.language.length > 0 && 
            response.body.software.length > 0 ){
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
})
