// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var story = exports;
var users = require('../models/users');
var stories = require('../models/stories');
var dateFormat = require('dateformat');

story.update = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
  if (req.method == 'POST') {
    var story = stories.newStory();
    story.sid = req.body.sid || null;
    story.title = req.body.title;
    story.url = req.body.url;
    story.body = req.body.body;
    story.tags = req.body.tags;
    story.pubdate = req.body.pubdate || dateFormat(new Date(), 'isoDateTime');

    if (story.sid === null) {
      stories.insert(story, cbInsert);
    } else {
      stories.update(story.sid, story, cbInsert);
    }

    function cbInsert(err) {
      if (err) {
        res.send(500);
      } else {
        res.redirect('/');
      }
    }

  } else {
    // POST以外のリクエストに対する処理
    res.redirect(403, '/');
    return;
  }
};
