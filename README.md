# Twitter-interface

### This interface provides 3 columns showing your 5 most recent tweets, 5 most recent friends(people you follow), and 5 most recent direct messages. 

To get started, please create a config file inside the 'js' folder, and name it 'config.js'. Format it in the following way, with your own consumer key and access token data inputted into the object:
```
const Twit = require('twit');

const T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
})


module.exports = T;
```
Install the required dependencies on your CLI with `npm install`, and start the app with `nodemon` at the appropriate directory.

The app runs on http://localhost:3000/
