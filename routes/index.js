
/*
 * GET home page.
 */

exports.admin = require('./admin');
exports.story = require('./story');
var stories = require('../models/stories');

// インデックスページを表示する
exports.index = function(req, res){
  var pageNum = Number(req.params.page) || 1;
  var count = 10;
  var skip = count * (pageNum - 1);

  // 次ページがあるかどうかを判断するため、count+1件を取得する
  stories.getLatest(count + 1, skip, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (items === null) {
      res.send(404, '404: Not Found.');
      return;
    }

    // 取得された記事数がcountよりも多ければ次ページがある
    var hasNext = false;
    if (items.length > count) {
      hasNext = true;
      items.pop();
    }
    // skipしていれば前ページがある
    var hasPrevious = (skip > 0);

    // テンプレートに与えるパラメータ
    var params = {
      page: {
        title: 'nblog',
        next: hasNext ? '/page/' + (pageNum + 1)
          : undefined,
        previous: hasPrevious ? '/page/' + (pageNum - 1)
          : undefined
      },
      user: req.session.user || false,
      stories: items,
      request: req
    };
    console.log(params);
    res.render('index', params);
  });
};

exports.tag = function(req, res){
  var pageNum = Number(req.params.page) || 1;
  var count = 10;
  var skip = count * (pageNum - 1);
  var tag = req.params.tag;

  stories.getByTag(tag, count, skip, function (err, items){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (items === null) {
      res.send(404, '404: Not Found.');
      return;
    }
    // 取得された記事数がcountよりも多ければ次ページがある
    var hasNext = false;
    if (items.length > count) {
      hasNext = true;
      items.pop();
    }
    // skipしていれば前ページがある
    var hasPrevious = (skip > 0);

    // テンプレートに与えるパラメータ
    var params = {
      page: {
        title: 'nblog: ' + req.params.tag,
        next: hasNext ? '/tag/' + tag + '/page/' + (pageNum + 1)
          : undefined,
        previous: (skip > 0) ? '/tag/' + tag + '/page/' + (pageNum - 1)
          : undefined
      },
      user: req.session.user || false,
      stories: items,
      request: req
    };
    res.render('index', params);
  });
}

exports.single = function(req, res){
  stories.getByUrl(req.params.url, function (err, item){
    if (err) {
      res.send(500, { error: 'cannot retrive stories', err: err });
      return;
    }
    if (item === null) {
      res.send(404, '404: Not Found.');
      return;
    }
    res.render('single', {
      page: { title: 'nblog' },
      user: req.session.user || false,
      story: item
    });
  });
};

