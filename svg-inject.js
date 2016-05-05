(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory();
  } else {
    root.inject = factory();
  }
})(this, function (){

  var slice = Array.prototype.slice;

  function ajax(url, callback){
    var request,
        error = function(err){
          callback(null,new Error(err));
        };
    request = new XMLHttpRequest();
    if ("withCredentials" in request) {
      // XHR for Chrome/Firefox/Opera/Safari.
      request.open('GET', url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      request = new XDomainRequest();
      request.open('GET', url);
    }
    request.onload = function() {
      if ( !this.status || (this.status >= 200 && this.status <= 400 ) ) {
        callback(this.responseText);
      } else { error(this.responseText); }
    };
    request.onerror = error;
    request.send();
    return request;
  }

  function inject(element, callback) {
    callback = callback || function(){};

    var attributes = {},
        url;

    slice.call(element.attributes).map(function(attr) {
      attributes[attr.name] = attr.value;
    });
    
    url = attributes['src'] || attributes['data-svg-inject'];
    if ( !url ) return;

    element.style.opacity = 0;

    return ajax(url,function(res,error){
      
      if ( error || !res ) { 
        element.style.opacity = 1;
        return callback(null,error);
      }
      
      var d = document.implementation.createHTMLDocument(""),
          svg;

      d.body.innerHTML = res;

      svg = d.getElementsByTagName('svg')[0];
      if ( !svg ) { return; }

      for ( var key in attributes ){
        svg.setAttribute(key,attributes[key]);
      }

      if (element.parentNode) {
        element.parentNode.replaceChild(svg, element)
      }

      return callback(svg);

    });
  }

  inject.ajax = ajax;

  inject.all = function(obj,callback) {
    obj = ( typeof obj === 'string' ? document.querySelectorAll(obj) :
           obj instanceof Node ? [obj] : obj );

    var length = obj.length,
        i = 0;

    for ( ; i < length; i++ ) {
      if ( inject.call( obj[i], obj[ i ], callback ) === false ) { break; }
    }

    return obj;
  };

  return inject;

});
