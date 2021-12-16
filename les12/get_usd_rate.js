let request = require('request')
let cbr_url = "https://www.cbr-xml-daily.ru/daily_json.js"
request(cbr_url, function(error, response, body) {
  if(error)
    console.log("Request error: " + error)
  if(response.statusCode != 200)
    console.log("Error. CBR responce code: " + response.statusCode)

  let rates = JSON.parse(body)
  let rates_timestamp = rates.Timestamp

  let unix_timestump = new Date(rates_timestamp)
  unix_timestump = unix_timestump.getTime()

  console.log('Rates Timestamp from CBR site: ' + rates_timestamp)
  console.log('Unix Rates Timestump: ' + unix_timestump)

  let str_timestump = new Date(unix_timestump)
  console.log('Formatted Timestump: ' + str_timestump)

  let USD_rate = rates.Valute.USD.Value

  console.log('CBR USD Exchange Rate from CBR site: ' + USD_rate)
  USD_rate = (USD_rate * 10000).toFixed()
  console.log('CBR USD Exchange Rate * 10000 =  ' + USD_rate)
})

