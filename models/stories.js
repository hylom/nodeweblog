// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var database = require('./database');
var db = new database.Database();
var stories = exports;
var dateformat = require('dateformat');

// Storyを表現するクラス
function Story(properties) {
  for (var key in properties) {
    this[key] = properties[key];
  }
  if (this.pubdate !== undefined) {
    this.pubdate = dateformat(this.pubdate, 'yyyy/mm/dd HH:MM:ss');
  }
};

Story.prototype.dateFormat = function (date) {
  return dateformat(date, 'yyyy/mm/dd HH:MM:ss');
}

// カンマ区切りのタグ情報をデータベースに記録する
function _insertTag(tagString, sid, callback) {
  console.log(tagString);
  var tags = tagString.split(',');
  var errors = [];
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i].trim();
    db.query(
      'INSERT INTO tags (name, sid) VALUES (?, ?);',
      [tag, sid], queryCallback
    );
  }
  function queryCallback(err, results, fields) {
    console.log(err);
    errors.push(err);
    if (errors.length == tags.length) {
      for (var i = 0; i < errors.length; i++) {
        if (errors[i]) {
          callback(errors[i]);
          return;
        }
      }
      callback(false);
    }
  }
}

// 記事を新規作成する
stories.insert = function (story, callback) {
  // FIXME: make enable to use multibyte characters
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate ];
  db.query(
    'INSERT INTO stories '
      + '(sid,  url, title, body, tags, cdate, mdate, pubdate) '
      + 'VALUES '
      + '(NULL, ?,   ?,     ?,    ?,    NOW(), NOW(), ?)'
      + ';',
    params, 
    function(err, results, fields) {
      var sid = results.insertId;
      if (err) {
        callback(new Error('Insert failed.'));
      } else {
        _insertTag(story.tags, sid, callback);
      }
    });
}

// データベース内の記事をアップデートする
stories.update = function (storyId, story, callback) {
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate,
	         storyId ];
  db.query(
    'UPDATE stories '
      + 'SET '
      + 'url = ?,'
      + 'title = ?,'
      + 'body = ?,'
      + 'tags = ?,'
      + 'mdate = now(),'
      + 'pubdate = ?'
      + 'WHERE sid = ?'
      + ';',
    params, function(err, results, fields) {
      callback(err);
    });
};

// tagを指定してデータベースから記事を取得する
stories.getByTag = function (tagName, count, callback) {
  db.query(
    'SELECT stories.* FROM stories '
      + 'JOIN tags ON stories.sid = tags.sid '
      + 'WHERE tags.name = ? '
      + 'ORDER BY sid DESC LIMIT ?;',
    [tagName, count],
    function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
        var stories = [];
        for (var i = 0; i < results.length; i++) {
          stories[i] = new Story(results[i]);
        }
	callback(false, stories);
      } else {
	callback(false, null);
      }
    });
}

// sidを指定してデータベースから記事を取得する
stories.getBySid = function (sid, callback) {
  db.query(
    'SELECT * FROM stories WHERE sid = ?;',
    [sid], function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
	var story = new Story(results[0]);
	callback(false, story);
      } else {
	callback(false, null);
      }
    });
};

// urlを指定してデータベースから記事を取得する
stories.getByUrl = function (url, callback) {
  db.query(
    'SELECT * FROM stories WHERE url = ?;',
    [url,], function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
	var story = new Story(results[0]);
	callback(false, story);
      } else {
	callback(false, null);
      }
    });
};

// データベースから記事を削除する
stories.remove = function (storyId, callback) {
  db.query(
    'DELETE from stories '
      + 'where sid = ?;',
    [storyId], callback);
};

// 最新n件の記事を取得する
stories.getLatest = function (count, callback) {
  db.query(
    'SELECT * FROM stories ORDER BY sid DESC LIMIT ?;', [count], function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
        var stories = [];
        for (var i = 0; i < results.length; i++) {
          stories[i] = new Story(results[i]);
        }
	callback(false, stories);
      } else {
	callback(false, null);
      }
    });
};

// 空のstoryオブジェクトを作成する
stories.newStory = function () {
  return new Story();
};
