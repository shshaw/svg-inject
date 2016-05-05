# svg-inject

Replace an `<img>` element with an inline SVG.

* Keeps your initial page weight down
* Takes advantage of browser caching
* Style & manipulate individual SVG pieces with CSS selectors or Javascript!


## Usage

### inject(element, [callback]) 

Replace the `<img>` `element` with an SVG, calling `callback(err, svg)` when
complete.

``` javascript
// Replaces the first <img> with inline SVG:
var img = document.querySelector('img[src$=".svg"]');
inject(img, function(svg, err) {
  if (err) { throw err }
  // do additional things with `svg` here if you like.
})
```

### inject.all(element, [callback]) 

svg-inject will use `querySelectorAll` and run `inject` on all the matching
DOM elements.

``` javascript
// Replaces the all elements that have a [data-inject] attribute with inline SVG:
inject.all('[data-inject]', function(svg, err) {
  if (err) { throw err }
  // do additional things with `svg` here if you like.
})
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/svg-inject/blob/master/LICENSE.md) for details.
