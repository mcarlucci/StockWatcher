// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const request = require('request')

setInterval(function() {
  var getInput = document.getElementById('stockTicker').value !== '' ? document.getElementById('stockTicker').value : false;
  if (getInput) {
    getStockPrice(getInput)
  } else {
    getStockPrice()
  }
}, 1000)

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

function newPrice(arr) {
  const currentPrice = arr[0]['l']
  const points = arr[0]['c']
  const yield = arr[0]['cp']
  const isPositive = /[+]/i.test(points);

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
