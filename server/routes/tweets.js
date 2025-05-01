"use strict";

const userHelper = require("../lib/util/user-helper");

const express = require('express');
const tweetsRoutes = express.Router();

module.exports = (dataHelpers) => {

  tweetsRoutes.get("/", (req, res) => {
    dataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    dataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    });
  });

  return tweetsRoutes;

};



const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const tweets = [];

app.post("/api/tweets", (req, res) => {
  const tweet = req.body;

  const newTweet = {
    ...tweet,
    created_at: Date.now(),
    user: {
      name: "User",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@User"
    }
  };

  tweets.unshift(newTweet);
  res.status(201).json(newTweet);
});

app.get("/api/tweets", (req, res) => {
  res.json(tweets);
});