// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var mysql = require('mysql');

var dbAuth = {
  user: 'nblogadmin',
  database: 'nblog',
  password: 'foobar',
  host: 'silver.local'
};

// ModelBase: Modelのベースクラス
function Database() {
}

Database.prototype.dbAuth = dbAuth;

// MySQLクライアントオブジェクトを作成する
Database.prototype._createClient = function () {
  var client = mysql.createClient(this.dbAuth);
  return client;
};

// クエリを実行する
Database.prototype.query = function (query, params, callback) {
  var client = this._createClient();
  client.query(query, params, callback);
}

exports.Database = Database;
