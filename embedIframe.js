var url = require('url');

module.exports = function embedIframeMiddleware(options) {
  options = options || {};
  options.acceptableHosts = options.acceptableHosts || [];

  return function (req, resp, next) {
    srcURL = req.url.slice(1);
    var parsedURL = url.parse(srcURL);

    for (var i = 0; i < options.acceptableHosts.length; i++) {
      if (parsedURL.host === options.acceptableHosts[i]) {
        return sendResponse(req, resp, srcURL, options);
      }
    }
    next();
  };
};

function sendResponse(req, resp, url, options) {
  var headerHTML = '<!DOCTYPE html><html><head>';
  var footerHTML = '</body></html>';
  if (options.useCSS) {
    headerHTML = headerHTML
      + '<link rel="stylesheet" href="'
      + options.useCSS
      + '">';
  }
  headerHTML = headerHTML + '</head>';
  var bodyHTML = '<script src="' + url + '"></script>';
  resp.writeHead(200, {'Content-Type': 'text/html'});
  resp.write(headerHTML);
  resp.write(bodyHTML);
  resp.write(footerHTML);
  resp.end();
  return;
}
