/**
 * import highlight.js
 * @{doc} https://highlightjs.org/usage/
 *        https://highlightjs.org/static/demo/
 */
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import http from 'highlight.js/lib/languages/http'
// const hljs = require('highlight.js/lib/highlight')
// const javascript = require('highlight.js/lib/languages/javascript')
// const json = require('highlight.js/lib/languages/json')
// const http = require('highlight.js/lib/languages/http')

(() => {
  /**
   * Init highlight.js
   */
  hljs.initHighlightingOnLoad()
  // register languages
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('http', http)
  document.querySelectorAll('hljs').forEach(block => hljs.highlightBlock(block))
  /**
   * String replacement
   * replace [origin] string by window.location.origin in url
   */
  const toReplaceElements = [...document.querySelectorAll('.origin')]
  toReplaceElements.forEach(elm => {
    elm.innerHTML = elm.innerText.replace('[origin]', window.location.origin)
  })
  /**
   * Fetch API on click event
   */
  document.querySelector('.btn__test').addEventListener('click', e => {
    const url = `${window.location.origin}/api/timestamp/2016-11-20`
    const resultElm = document.getElementById('result')
    resultElm.style.opacity = '1'
    resultElm.style.padding = '0.5em'
    resultElm.parentNode.style.marginBottom = '20px'
    // handle fetch error
    const handleErrors = response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    }
    // fetch the API
    fetch(url)
      .then(handleErrors)
      .then(json => json.json())
      .then(data => {
        resultElm.innerHTML = JSON.stringify(data, undefined, 2)
        hljs.highlightBlock(resultElm) // highlight
      })
      .catch(err => {
        console.error(err)
        resultElm.innerHTML = 'ERROR: Failed to fetch'
      })
  })
})()
