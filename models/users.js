// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var crypto = require('crypto');
var database = require('./database');
var db = new database.Database();
var users = exports;

// 認証を行う
users.authenticate = function (name, password, callback) {
  db.query('SELECT * FROM users WHERE name = ?',
	     [name,], queryCallback);
  function queryCallback(err, results, fields) {
    if (err) {
      callback(err, null);
      return;
    }
    if (results && (results.length > 0)) {
      userInfo = results[0];
      if (userInfo.password == hashPassword(password)) {
	delete userInfo.password;
	callback(false, userInfo);
	return;
      }
    }
    // 該当ユーザー無し
    callback(err, null);
    return;
  }
}

// ユーザー名からアカウント情報を取得する
users.getByUsername = function (name, callback) {
  db.query('SELECT * FROM users WHERE name = ?',
	     [name,], queryCallback);
  function qurryCallback(err, results, fields) {
    if (err) {
      callback(err, undefined);
      return;
    }
    if (results && (results.length > 0)) {
      userInfo = results[0];
      delete userInfo.password;
      callback(false, userInfo);
    } else {
      callback(false, null);
    }
  }
}
  
// パスワードのハッシュを作成する
var hashPassword = function (password) {
  if (password === '') {
    return '';
  }
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
}

// 実際のアップデート処理を行うローカル関数
function _updateUser(user, callback) {
  var params = [
    user.name,
    user.password,
    user.uid
  ];
  db.query(
    'UPDATE users '
      + 'SET '
      + 'name = ?,'
      + 'password = ?'
      + 'WHERE uid = ?'
      + ';',
    params, function(err, results, fields) {
      delete user.password;
      callback(err);
    });
}

// アカウント情報をアップデートする
users.update = function (user, oldPassword, callback) {
  // パスワードを更新する際は旧パスワードの情報が必須
  var newPassword = '';
  console.log(user);
  if (user.password !== undefined) {
    users.authenticate(user.name, oldPassword, function (err, oldUser) {
      if (err) {
        // クエリエラー
        callback(err);
        return;
      }
      if (!oldUser) {
        // クエリは成功したが認証に失敗
        console.log(oldUser);
        var err = new Error('Invalid password');
        callback(err);
        return;
      }
      // 認証成功
      user.password = hashPassword(user.password);
      _updateUser(user, callback);
    });
    return;
  }

  // それ以外の更新の場合
  _updateUser(user, callback);
};

