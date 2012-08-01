
/*
 * GET home page.
 */

exports.admin = require('admin');

var stories = require('stories').connect(app.get('user'), 
					 app.get('database'),
					 app.get('passwd'));

exports.index = function(req, res){
  stories.getLatest(10, function (err, items){
    res.render('index', {
      page: {
        title: 'nblog',
      },
      blog: app.get('blog'),
      stories: items,
    });
  });
};

