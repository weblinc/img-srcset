img-srcset
==========

Responsive images based on the 'srcset' attribute proposal. See http://dev.w3.org/html5/srcset/.

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
