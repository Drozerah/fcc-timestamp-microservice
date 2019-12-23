(() => {
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
      })
      .catch(err => {
        console.error(err)
        resultElm.innerHTML = 'ERROR: Failed to fetch'
      })
  })
})()
