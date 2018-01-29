const express = require('express');
const app = express();

const t = require('./js/config');

let friendIDs = [];
let tweets = [];
let user = [];
let direct_messages = [];

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');


//************ TIMESTAMP ************//

function twitterfyTime(time) {
    let system_date = new Date(Date.parse(time));
    let user_date = new Date();

    let diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 60) {return diff + "s";}
    if (diff <= 3540) {return Math.round(diff / 60) + "m";}
    if (diff <= 86400) {return Math.round(diff / 3600) + "h";}
    if (diff <= 129600) {return "1 day";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days";}
    if (diff <= 777600) {return "a week ago";}
    return "on " + system_date;
}


function secsToDate(secs) {
    let system_date = new Date(secs);
    let user_date = new Date();

    let diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 60) {return diff + "s";}
    if (diff <= 3540) {return Math.round(diff / 60) + "m";}
    if (diff <= 86400) {return Math.round(diff / 3600) + "h";}
    if (diff <= 129600) {return "1 day";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days";}
    if (diff <= 777600) {return "a week ago";}
    return "on " + system_date.toString().slice(4, 15);
}

//************ TWITTER INTERFACE ************//

app.use(

  //************ USER ************//
  (req, res, next)=>{
    t.get('account/verify_credentials', { skip_status: true},  function (err, data, res) {
      if (err) throw err;
      let username = data.name;
      let user_pic = data.profile_image_url_https;
      let screen_name = data.screen_name;
      let userinfo = {username: username, user_pic: user_pic, screen_name: screen_name};
      user.push(userinfo);
      next();
    })
  },

  //************ FOLLOWING ************//
  (req, res, next)=>{
    t.get('friends/list', { user_id: t.user_id },  function (err, data, res) {
      if (err) throw err;
     for(let i = 0; i <= 4; i++){
       let name = data.users[i].name;
       let url = '@'+ data.users[i].screen_name;
       let id = data.users[i].id_str;
       let photo = data.users[i].profile_image_url_https;
       let profile = {name: name, id : id, url : url, photo: photo}
      friendIDs.push(profile);
     };
  //   console.log(friendIDs)
      next();
    })
  },


  //************ TIMELINE ************//
  (req, res, next)=>{
    t.get(`statuses/home_timeline`, { user_id: t.user_id},  function (err, data, res) {
      if (err) throw err;
      for(let i = 0; i <=4; i++){
        let name = data[i].user.name;
        let url = '@'+ data[i].user.screen_name;
        let tweet_id = data[i].id_str;
        let id = data[i].user.id_str;
        let photo = data[i].user.profile_image_url_https;
        let tweetPost = data[i].text;
        let time = twitterfyTime(data[i].created_at);
        let retweet = data[i].retweet_count;
        let favorite = data[i].favorite_count;
        let quoting = data[i].quoted_status;
        let tweet = {name: name, id : id, photo: photo, url : url, post: tweetPost,
                    retweeted: retweet, favorited: favorite, time: time, tweet_id: tweet_id};
        if (quoting != undefined){
          tweet.quoting = quoting;
        };
       tweets.push(tweet);
      }
      next();
    })
  },

  //************ DIRECT MESSAGES ************//
  (req, res, next)=>{
    t.get('direct_messages/events/list', {count: 5},  function (err, data, res) {
      if (err) throw err;
      // for(let i =0; i<=4; i++){
      //   let message_text = JSON.stringify(data[i].text);
      //   let sender = data[i].sender.screen_name;
      //   let image = data[i].sender.profile_image_url_https;
      //   let time = twitterfyTime(data[i].created_at);
      //   let message = {message_text: message_text, sender: sender, image: image, time:time};
      //   direct_messages.push(message);
      // }
       for(let i=0; i<4; i++){
         let text = data.events[i].message_create.message_data.text;
         let sender = data.events[i].message_create.sender_id;
         let time = secsToDate(parseInt(data.events[i].created_timestamp));
         let person = JSON.stringify(friendIDs.filter(friend => friend.id == sender));
         let image = person.slice(person.indexOf("https"), -3);
         let screen_name = person.slice(person.indexOf("name"), person.indexOf("id"));
         screen_name = screen_name.slice(7,-3);
         if (person.length < 5){
           image = user[0].user_pic;
           screen_name = user[0].screen_name;
         }
         let dm = {text:text, sender: sender, time: time, image: image, screen_name: screen_name}
         direct_messages.push(dm);
       }
  //    console.log(direct_messages);
       app.get('/', (req, res)=>{
         if (err) throw err;
         res.render('interface', {friends: friendIDs, myname: t.screen_name, tweets: tweets, user: user,
            direct_messages: direct_messages});
       })
           next();
    })

  }
);



app.listen(3000, function(){
  console.log("you're connected to port 3000");
});
