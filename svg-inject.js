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
  
  function inject(element, callback) {
    callback = callback || function(){};
  
    var url = element.getAttribute('src')
    if ( !url ) return;
  
    var attributes = slice.call(element.attributes).map(function(attr) {
      return [attr.name, attr.value];
    })
  
    element.style.opacity = 0;
  
    return fetch(url, { method: 'get' })
      .then(function(res) {
        return res.text();
      }).then(function(res){
        var div = document.createElement('div');
        div.innerHTML = res;
  
        var svg = div.firstChild;
        for (var i = 0; i < attributes.length; i++) {
          svg.setAttribute(attributes[i][0], attributes[i][1])
        }
  
        if (element.parentNode) {
          element.parentNode.replaceChild(svg, element)
        }
  
        callback(svg);
      })
      .catch(function(err){
        callback(null,new Error(err));
      });
  }
  
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
