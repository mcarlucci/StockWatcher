// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const request = require('request')

// handler to get company name
let companyNameHandler = debounce(function() {
  let input = getInput()
  if (input) {
    getCompanyName(input)
  } else {
    getCompanyName()
  }
}, 250)

// add event listeners for ticker input field
let tickerInput = document.getElementById("stockTicker")
tickerInput.addEventListener('keyup', companyNameHandler, false)
tickerInput.addEventListener('search', companyNameHandler, false)

// get latest stock data for a given stock symbol every second
setInterval(function() {
  let input = getInput()
  if (input) {
    getStockPrice(input)
  } else {
    getStockPrice()
  }
}, 1000)


/*
 * Core Functions
 */

// get stock data by ticker symbol
function getStockPrice(ticker = 'goog') {
  try {
    request(`http://finance.google.com/finance/info?q=${ticker}`, function(error, response, body) {
      body = body.slice(3)
      body = JSON.parse(body)
      newPrice(body)
    })
  } catch(e) {
    console.log(e)
  }
}

// get company name by ticker symbol
function getCompanyName(ticker = 'goog') {
  try {
    request(`http://d.yimg.com/aq/autoc?query=${ticker}&region=US&lang=en-US`, function(error, response, body) {
      body = JSON.parse(body)
      body = body.ResultSet.Result[0].name
      document.getElementById('companyName').innerHTML = body
    })
  } catch(e) {
    console.log(e)
  }
}

// display latest price data
function newPrice(arr) {
  const currentPrice = arr[0]['l']
  const points = arr[0]['c']
  const yield = arr[0]['cp']
  const isPositive = /[+]/i.test(points)

  document.getElementById('stockPrice').innerHTML = currentPrice
  document.getElementById('stockPoints').innerHTML = points
  document.getElementById('stockYield').innerHTML = `(${yield}%)`

  if (isPositive) {
    document.getElementById('stockYield').classList.remove('red')
    document.getElementById('stockYield').classList.add('green')
    document.getElementById('stockPoints').classList.remove('red')
    document.getElementById('stockPoints').classList.add('green')
  } else {
    document.getElementById('stockYield').classList.remove('green')
    document.getElementById('stockYield').classList.add('red')
    document.getElementById('stockPoints').classList.remove('green')
    document.getElementById('stockPoints').classList.add('red')
  }
}

// get current input data for stockTicker element
function getInput() {
  return document.getElementById('stockTicker').value !== '' ? document.getElementById('stockTicker').value : false
}


/*
 * Helper Functions
 */

 // Returns a function, that, as long as it continues to be invoked, will not
 // be triggered. The function will be called after it stops being called for
 // N milliseconds. If `immediate` is passed, trigger the function on the
 // leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this, args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
