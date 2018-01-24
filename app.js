const express = require('express');
const app = express();

const t = require('./js/config');

let friendIDs = [];
let tweets = [];

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

// app.get('/', (req, res)=>{
//   return res.send(t.screen_name);
// });

app.use(
  (req, res, next)=>{
    t.get('friends/list', { user_id: t.user_id },  function (err, data, res) {
      if (err) throw err;
     for(let i = 0; i <= 5; i++){
       let name = data.users[i].name;
       let atURL = '@'+ data.users[i].screen_name;
       let id = data.users[i].id_str;
       let photo = data.users[i].profile_image_url;
       let profile = {name: name, id : id, photo: photo, url : atURL}
      friendIDs.push(profile);
     };
      console.log(friendIDs);
      next();
    })
  },
  (req, res, next)=>{
    t.get(`statuses/user_timeline`, { user_id: t.user_id},  function (err, data, res) {
      if (err) throw err;
      for(let i = 0; i <=4; i++){
        let name = data[i].user.name;
        let atURL = '@'+ data[i].user.screen_name;
        let id = data[i].user.id_str;
        let photo = data[i].user.profile_image_url;
        let tweetPost = data[i].text;
        let time = data[i].created_at;
        let retweet = data[i].retweet_count;
        let favorite = data[i].favorite_count;
        let quoting = data[i].quoted_status;
  //      let timeStamp = timeSince(time);
        let tweet = {name: name, id : id, photo: photo, url : atURL, post: tweetPost, retweeted: retweet, favorited: favorite};
        if (quoting != undefined){
          tweet.quoting = quoting;
        };
       tweets.push(tweet);
      }
      app.get('/', (req, res)=>{
        res.render('interface');
      })
      console.log(tweets);
      next();
    })
  }
);



app.listen(3000, function(){
  console.log("you're connected to port 3000");
});

// app.get('/', (req, res)=>{
//   let posts = [];
//   for(let i = 0; i<= tweets.length; i++){
//     let post = tweets[i].post;
//     let id = tweets[i].id;
//     console.log(post);
//     posts +=post;
//   }
//   console.log(posts);
//   res.render('timeline', {tweets});
// });


//timestamp
// function timeSince(timeStamp) {
//   var now = new Date(),
//     secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
//   if(secondsPast < 60){
//     return parseInt(secondsPast) + 's';
//   }
//   if(secondsPast < 3600){
//     return parseInt(secondsPast/60) + 'm';
//   }
//   if(secondsPast <= 86400){
//     return parseInt(secondsPast/3600) + 'h';
//   }
//   if(secondsPast > 86400){
//       day = timeStamp.getDate();
//       month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
//       year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
//       return day + " " + month + year;
//   }
// }
