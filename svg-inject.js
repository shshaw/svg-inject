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
    request.open("GET", url);
    request.onreadystatechange = function() {
      if (4 === this.readyState) {
        if ( this.status >= 200 && this.status <= 400 ) {
          callback(this.responseText);
        } else { error(this.responseText); }
      }
    };
    request.onerror = error;
    request.send();

    return request;
  }

  function inject(element, callback) {
    callback = callback || function(){};

    var url = element.getAttribute('src'),
        attributes = {};

    if ( !url ) return;

    slice.call(element.attributes).map(function(attr) {
      attributes[attr.name] = attr.value;
    });

    element.style.opacity = 0;

    return ajax(url,function(res){
        var div = document.createElement('div');
        div.innerHTML = res;

        var svg = div.firstChild;
        for ( var key in attributes ){
          svg.setAttribute(key,attributes[key]);
        }

        if (element.parentNode) {
          element.parentNode.replaceChild(svg, element)
        }

        callback(svg);
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
