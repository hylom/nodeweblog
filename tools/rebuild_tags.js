// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var database = require('../models/database');
var db = new database.Database();
var dateformat = require('dateformat');

// カンマ区切りのタグ情報をデータベースに記録する
function _insertTag(tagString, sid, callback) {
  var tags = tagString.split(',');
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i].trim();
    db.query( 'INSERT INTO tags (name, sid) VALUES (?, ?);',
              [tag, sid] );
  }
  db.end(callback);
}

function rebuildTags() {
  var query = db.query('SELECT * FROM stories;');
  query.on('row', function(row) {
    var tags = row.tags;
    var sid = row.sid;
    console.log(sid + ':' + tags);
    _insertTag(tags, sid);
  });
  db.end()
}

rebuildTags();
console.log('rebuilding tags...');

