// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var mysql = require('mysql');
var modelbase = require('./modelbase');

// Stories: 記事にアクセスするためのクラス
function Stories(dbAuth) {
  this.dbAuth = dbAuth;
}
Stories.prototype = new modelbase.ModelBase();

// 記事を新規作成する
Stories.prototype.insert = function (story, callback) {
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate ];
  var query = this.query(
    'INSERT INTO stories'
      + 'SET '
      + 'url = ?,'
      + 'title = ?,'
      + 'body = ?,'
      + 'tags = ?,'
      + 'cdate = now(),'
      + 'mdate = now(),'
      + 'pubdate = ?'
      + ';',
    params, callback);
}

// sidを指定してデータベースから記事を取得する
Stories.prototype.getByStoryId = function (storyId, callback) {
  this.query(
    'SELECT * FROM stories WHERE sid = ?;',
    [storyId,], function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
	var story = results[0];
	callback(false, story);
      } else {
	callback(false, null);
      }
    });
};

// データベース内の記事をアップデートする
Stories.prototype.update = function (storyId, story, callback) {
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate,
	         storyId ];
  var query = this.query(
    'UPDATE stories '
      + 'SET '
      + 'url = ?,'
      + 'title = ?,'
      + 'body = ?,'
      + 'tags = ?,'
      + 'mdate = now(),'
      + 'pubdate = ?'
      + 'WHERE page_id = ?'
      + ';',
    params, function(err, results, fields) {
      callback(err);
    });
};

// データベースから記事を削除する
Stories.prototype.remove = function (storyId, callback) {
  var query = this.query(
    'DELETE from stories '
      + 'where sid = ?;',
    [storyId,], callback);
};

// 最新n件の記事を取得する
Stories.prototype.getLatest = function (num, callback) {
  this.query(
    'SELECT * FROM stories ORDER BY sid DESC LIMIT ?;', [num], function(err, results, fields) {
      if (err) {
	callback(err, undefined);
	return;
      }
      if (results && (results.length > 0)) {
	var stories = results;
	callback(false, stories);
      } else {
	callback(false, null);
      }
    });
};

// Storiesオブジェクトを返す
exports = new Stories();
