// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var mysql = require('mysql');
var config = require('../config');

var dbAuth = config.databaseAuth;

// ModelBase: Modelのベースクラス
function Database() {
}

Database.prototype.dbAuth = dbAuth;

// MySQLクライアントオブジェクトを作成する
Database.prototype._getClient = function () {
  if (this.client === undefined) {
    this.client = mysql.createClient(this.dbAuth);
  }
  return this.client;
};

// クエリを実行する
Database.prototype.query = function (query, params, callback) {
  var client = this._getClient();
  client.query(query, params, callback);
}

// クエリを終了する
Database.prototype.end = function (callback) {
  var client = this._getClient();
  client.end(callback);
  delete this.client;
}

exports.Database = Database;
