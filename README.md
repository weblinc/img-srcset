img-srcset
==========

Responsive images based on the 'srcset' attribute proposal. See http://dev.w3.org/html5/srcset/. 
Lightweight, no nonsense, all browser supporting, fast polyfill for img ```srcset```.

* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera, Safari
* **Size**: 1.21KB minified (700 bytes gzipped)

Examples
---
Simple high density screen ('retina') query
```
<img srcset="image.jpg 1x, image@2x.jpg 2x" alt="image" />
```

Viewport width and pixel density query
```
<img srcset="low.jpg 400w 1x, medium.jpg 750w 1x, high.jpg 1000w 1x" alt="image" />
```

###Dependencies
None, simple javascript for fast execution. Version 1 relied on media-match.