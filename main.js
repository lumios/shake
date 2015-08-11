var Twitter = require("twitter");
var keys = require("./keys.js");

var client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
});


client.get('statuses/user_timeline', {screen_name: 'eewbot'}, function(error, tweets, response) {
    if (!error) {
        console.log(tweets);
    }
});
