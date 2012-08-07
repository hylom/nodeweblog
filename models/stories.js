// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var database = require('./database');
var db = new database.Database();

// 記事を新規作成する
exports.insert = function (story, callback) {
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate ];
  db.query(
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
exports.getByStoryId = function (storyId, callback) {
  db.query(
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
exports.update = function (storyId, story, callback) {
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
      + 'WHERE page_id = ?'
      + ';',
    params, function(err, results, fields) {
      callback(err);
    });
};

// データベースから記事を削除する
exports.remove = function (storyId, callback) {
  db.query(
    'DELETE from stories '
      + 'where sid = ?;',
    [storyId,], callback);
};

// 最新n件の記事を取得する
exports.getLatest = function (num, callback) {
  db.query(
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

