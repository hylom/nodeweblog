// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var mysql = requre('mysql');

// Stories: 記事にアクセスするためのクラス
function Stories(user, database, passwd) {
  this.user = user;
  this.database = database;
  this.passwd = passwd;
}

// MySQLクライアントオブジェクトを作成する
Stories.prototype._createClient = function () {
  var client = mysql.createClient({
    user: this.user,
    password: this.passwd,
    database: this.database,
  });
  return client;
};

// 記事を新規作成する
Stories.prototype.insert = function (story, callback) {
  var client = this._createClient();
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate ];
  var query = client.query(
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
  var client = this._createClient();
  client.query(
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
  var client = this._createClient();
  var params = [ story.url,
		 story.title,
		 story.body,
		 story.tags,
		 story.pubdate,
	         storyId ];
  var query = client.query(
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
  var client = this._createClient();
  var query = client.query(
    'DELETE from stories '
      + 'where sid = ?;',
    [storyId,], callback);
};


// Storiesオブジェクトを返す
exports.connect = function (user, database, passwd) {
  return new Stories(user, database, passwd);
}
