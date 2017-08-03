module.exports = {
  logRequestContents : function(request) {
    console.log(Object.keys(request));
    if(request._readableState) {
      console.log("_readableState:" + request._readableState);
    }
    if(request.readable) {
      console.log("readable:" + request.readable);
    }
    if(request.domain) {
      console.log("domain:" + request.domain);
    }
    // if(request._events) {
    //   console.log("_events:" + request._events);
    // }
    if(request._eventsCount) {
      console.log("_eventsCount:" + request._eventsCount);
    }
    if(request.__maxListeners) {
      console.log("__maxListeners:" + request.__maxListeners);
    }
    if(request.socket) {
      console.log("socket:" + request.socket);
    }
    if(request.connection) {
      console.log("connection:" + request.connection);
    }
    if(request.httpVersionMajor) {
      console.log("httpVersionMajor:" + request.httpVersionMajor);
    }
    if(request.httpVersionMinor) {
      console.log("httpVersionMinor:" + request.httpVersionMinor);
    }
    if(request.httpVersion) {
      console.log("httpVersion:" + request.httpVersion);
    }
    if(request.complete) {
      console.log("complete:" + request.complete);
    }
    if(request.headers) {
      console.log("headers:" + request.headers);
    }
    if(request.rawHeaders) {
      console.log("rawHeaders:" + request.rawHeaders);
    }
    if(request.trailers) {
      console.log("trailers:" + request.trailers);
    }
    if(request.rawTrailers) {
      console.log("rawTrailers:" + request.rawTrailers);
    }
    if(request.upgrade) {
      console.log("upgrade:" + request.upgrade);
    }
    if(request.url) {
      console.log("url:" + request.url);
    }
    if(request.method) {
      console.log("method:" + request.method);
    }
    if(request.statusCode) {
      console.log("statusCode:" + request.statusCode);
    }
    if(request.statusMessage) {
      console.log("statusMessage:" + request.statusMessage);
    }
    if(request.client) {
      console.log("client:" + request.client);
    }
    if(request._consuming) {
      console.log("_consuming:" + request._consuming);
    }
    if(request._dumped) {
      console.log("_dumped:" + request._dumped);
    }
    // if(request.next) {
    //   console.log("next:" + request.next);
    // }
    if(request.baseUrl) {
      console.log("baseUrl:" + request.baseUrl);
    }
    if(request.originalUrl) {
      console.log("originalUrl:" + request.originalUrl);
    }
    if(request._parsedUrl) {
      console.log("_parsedUrl:" + request._parsedUrl);
    }
    if(request.params) {
      console.log("params:" + JSON.stringify(request.params));
    }
    if(request.query) {
      console.log("query:" + request.query);
    }
    if(request.res) {
      console.log("res:" + request.res);
    }
    if(request.route) {
      console.log("route:" + JSON.stringify(request.route));
    }
  }
}