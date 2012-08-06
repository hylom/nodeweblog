// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var mysql = require('mysql');

// ModelBase: Modelのベースクラス
function ModelBase(dbAuth) {
  this.dbAuth = dbAuth;
}

// MySQLクライアントオブジェクトを作成する
ModelBase.prototype._createClient = function () {
  var client = mysql.createClient(this.dbAuth);
  return client;
};

// クエリを実行する
ModelBase.prototype.query = function (query, params, callback) {
  var client = this._createClient();
  client.query(query, params, callback);
}

exports.ModelBase = ModelBase;
