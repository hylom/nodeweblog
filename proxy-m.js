var owns = {}.hasOwnProperty;
module.exports = function proxyMiddleware(options) {
  var httpLib = options.protocol === 'https:' ? 'https' : 'http';
  var request = require(httpLib).request;
  options = options || {};
  options.hostname = options.hostname;
  options.port = options.port;

  return function (req, resp, next) {
    var url = req.url;
    // You can pass the route within the options, as well
    if (typeof options.route === 'string') {
      var route = slashJoin(options.route, '');
      if (url.slice(0, route.length) === route) {
        url = url.slice(route.length);
      } else {
        return next();
      }
    }

    //options for this request
    var opts = extend({}, options);
    opts.path = slashJoin(options.pathname, url);
    opts.method = req.method;
    opts.headers = options.headers ? merge(req.headers, options.headers) : req.headers;

    var myReq = request(opts, function (myRes) {
      if (resp.headersSent) {
        console.log('header already sent. request: '
                    + opts.method + ' ' + opts.path);
        return;
      }
      try {
        resp.writeHead(myRes.statusCode, myRes.headers);
      } catch (e) {
        console.log(e.name + ': ' + e.message + ' - ' 
                    + opts.method + ' ' + opts.path);
        return;
      }
      myRes.on('error', function (err) {
        resp.send(500, err.name);
      });
      myRes.pipe(resp);
    });
    myReq.on('error', function (err) {
      // return 500 (Internal Server Error)
      resp.send(500, err.code);
    });
    myReq.setTimeout(5000, function () {
      // abort request, then 'error' event occurs in request object
      myReq.abort();
    });
    if (!req.readable) {
      myReq.end();
    } else {
      req.pipe(myReq);
    }
  };
};

function slashJoin(p1, p2) {
  if (p1.length && p1[p1.length - 1] === '/') {p1 = p1.substring(0, p1.length - 1); }
  if (p2.length && p2[0] === '/') {p2 = p2.substring(1); }
  return p1 + '/' + p2;
}

function extend(obj, src) {
  for (var key in src) if (owns.call(src, key)) obj[key] = src[key];
  return obj;
}

//merges data without changing state in either argument
function merge(src1, src2) {
    var merged = {};
    extend(merged, src1);
    extend(merged, src2);
    return merged;
}
