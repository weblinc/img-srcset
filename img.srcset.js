/* imgsrcset - Img srcset polyfill for resolution responsive images. Authors & copyright (c) 2012: WebLinc, David Knight. */
/* NOTE: Depends on Media object. See https://github.com/weblinc/media-match */

// Imgsrcset
(function(win) {
    var _ratioExpr   = /\b[\d\.]+x\b/g,
        _srcExpr     = /[^\s]+/g,
        _res         = Media.features.resolution;

    /*
        imgsrcset
    */
    win.imgsrcset = function() {
        var imgs    = win.document.getElementsByTagName('img') || [],
            imgsl   = imgs.length - 1;

        do {
            var img     = imgs[imgsl],
                srcset  = img.getAttribute('srcset') || '',
                ratios  = srcset.match(_ratioExpr) || [],
                ratiol  = ratios.length - 1,
                src     = '';

            if (!srcset) {
                continue;
            }

            do {
                var dppx = parseFloat(ratios[ratiol]) * 96;

                // Math.floor supports the situations when using values such as 1.5x or 1.3x (equals 1)
                if (_res === dppx || Math.floor(_res) === Math.floor(dppx)) {
                    src = srcset.match(_srcExpr)[(ratiol % 2) * 2];
                    break;
                }
            } while(ratiol--);

            src && img.setAttribute('src', src);
        } while(imgsl--);
    };

    if (win.addEventListener) {
        win.addEventListener('load', win.imgsrcset);
    } else {
        win.attachEvent('onload', win.imgsrcset);
    }
})(window);