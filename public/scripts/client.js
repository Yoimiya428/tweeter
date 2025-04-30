// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]


const timeAgo = (timestamp) => {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo > 0) {
    return `${daysAgo} days ago`;
  } else if (hoursAgo > 0) {
    return `${hoursAgo} hours ago`;
  } else if (minutesAgo > 0) {
    return `${minutesAgo} minutes ago`;
  } else {
    return `${secondsAgo} seconds ago`;
  }
};


$(document).ready(function () {
  loadTweets();

  $('#error-message').hide();

  $('.new-tweet form').submit(function (event) {
    event.preventDefault();

    $('#error-message').slideUp();

    const tweetContent = $(this).find("textarea").val();
    const errorMessage = validateTweet(tweetContent);

    if (errorMessage) {
      $('#error-message p').text(errorMessage);
      $('#error-message').slideDown();
      return;
    }

    const formData = $(this).serialize();

    $.post('/api/tweets', formData)
      .then(() => {
        $textarea.val('');        
        $('.counter').text(140);  
        loadTweets();             
      })
      .catch((err) => {
        console.error('Tweet post failed:', err);
      });
  });

  const validateTweet = function (tweet) {
    if (!tweet || tweet.trim() === '') {
      return "Tweet cannot be empty!";
    }
    if (tweet.length > 140) {
      return "Tweet should be within 140 characters!";
    }
    return null;
  };

});



const renderTweets = function(tweets) {
  $('#tweets-container').empty(); // Clear existing tweets
  for (const newTweet of tweets) {
    const $tweetElement = createTweetElement(newTweet);
    $('#tweets-container').append($tweetElement);
  }
}

const createTweetElement = function(tweet) {
  const { user, content, created_at } = tweet;
  
  const time = timeAgo(created_at);

  let $tweet = $(`
    <article class="tweet">
      <header>
        <div class="user">
          <img src="${user.avatars}" class="avatar">
          <span class="username">${user.name}</span>
          <span class="At_user">${user.handle}</span>
        </div>
      </header>
      <p class="tweet-content">${content.text}</p>
      <footer>
        <div class="timestamp">
          <p>${time}</p>
        </div>
        <div class="icons">
          <button class="icon-reply"> <i class="fa-solid fa-flag"></i></button>
          <button class="icon-retweet"> <i class="fa-solid fa-retweet"></i></button>
          <button class="icon-like"><i class="fa-solid fa-heart"></i></button>
        </div>
      </footer>
    </article>
  `);
  $tweet.find('.tweet-content').text(content.text);

  return $tweet;
};


const loadTweets = function() {
  $.ajax({
    url: '/api/tweets',
    method: 'GET',
    dataType: 'json',
    success: function(tweets) {
      renderTweets(tweets); 
    },
    error: function(error) {
      console.error("Couldn't be loaded", error);
    }
  });
};

app.post("/api/tweets", (req, res) => {
  const tweet = req.body;
  const newTweet = {
    ...tweet,
    created_at: Date.now(),
    user: {
      name: "User",
      avatars: "avatar_url",
      handle: "@handle"
    }
  };

  tweets.push(newTweet);
  res.status(201).json(newTweet); 
});



