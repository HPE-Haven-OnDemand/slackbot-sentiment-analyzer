var env = process.env.NODE_ENV || 'dev'
if (env == 'dev') {
  require('dotenv').load()
}

// Define client for Haven OnDemand
var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient(process.env.HOD_APIKEY)

//Define Botkit controller
var Botkit = require('Botkit')

var controller = Botkit.slackbot({
    debug: false
})

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM()

// If someone directly mentions the bot
controller.hears(['analyze sentiment of (.*)'], 'direct_mention', function(bot, message) {
  var text = message.match[1] //Extract text from Slack message
  var data = {text: text}
  client.post('analyzesentiment', data, function(err, resp, body) {
    var overallSentiment = resp.body.aggregate.sentiment // Get overall sentiment
    var overallScore = resp.body.aggregate.score // Get overall Score
    var replyText = "Finished analyzing *'" + text +  "'*\nThe overall sentiment is *" + overallSentiment + "*\nThe overall score is *" + overallScore + "*" // Format reply text
    bot.reply(message, replyText) // Reply with information
  })
})
