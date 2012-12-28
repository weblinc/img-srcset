/* imgsrcset - Img srcset polyfill for resolution responsive images. Authors & copyright (c) 2012: WebLinc, David Knight. */
/* NOTE: Depends on Media object. See https://github.com/weblinc/media-match */

// Imgsrcset
(function(win) {
    'use strict';

    var _srcsetl    = 0,
        _ratioExpr  = /\b[\d\.]+x\b/g,
        _srcExpr    = /[^\s]+/g,
        _timer      = 0;

    /*
        imgsrcset
    */
    win.Imgsrcset = {
        // Properties
        srcsets: [],

        // Methods

        /*
            parse
        */
        parse: function() {
            this.srcsets = [];

            var imgs    = win.document.getElementsByTagName('img') || [],
                imgsl   = imgs.length - 1;

            do {
                var img     = imgs[imgsl],
                    srcset  = img.getAttribute('srcset') || '';

                if (!srcset) {
                    continue;
                }

                this.srcsets.push({
                    element     : img,
                    media       : srcset,
                    matches     : false
                });

                _srcsetl++;
            } while(imgsl--);
        },

        /*
            parseMatch
        */
        parseMatch: function(srcset) {
            var srcsetList  = srcset.replace(/\s*,\s*/, ',').split(','),
                srcsetl     = srcsetList.length,
                mql         = {src: '', media: '', matches: false},
                match       = true;

            while (srcsetl--) {
                var list   = srcsetList[srcsetl].match(/[^\s]+/g),
                    listl  = list.length;

                match = true;

                while (listl--) {
                    var item = list[listl];
                    if (listl === 0) {
                        mql.src = item;
                    } else {
                        var prop        =   (item.indexOf('w') !== -1 && 'width') || 
                                            (item.indexOf('h') !== -1 && 'height') || 
                                            (item.indexOf('x') !== -1 && 'resolution'),
                            digits      = item.match(/\d+/)[0],
                            feature     = win.Media.features[prop],
                            absValue    = win.Media.getAbsValue(digits + ((prop === 'resolution' && 'dppx') || ''));

                        if (!(match = ((prop === 'resolution' && feature === absValue) || (prop !== 'resolution' && feature <= absValue)))) {
                            break;
                        }
                    }
                }

                if (match) {
                    mql.media = srcsetList[srcsetl];
                    mql.matches = match;
                }
            }

            return (mql.matches && mql) || false;
        },

        /*
            watch
        */
        watch: function(evt) {
            clearTimeout(_timer);

            _timer = setTimeout(function() {
                var id = _srcsetl;

                do {
                    var srcset  = win.Imgsrcset.srcsets[id],
                        match   = false;

                    if (typeof srcset === 'undefined') { continue; }

                    match = win.Imgsrcset.parseMatch(srcset.media);

                    if (match && !(srcset.matches === match.media)) {
                        srcset.matches = match.media;

                        srcset.element.setAttribute('src', match.src);
                    } else if (!match) {
                        srcset.matches = false;
                    }
                } while(id--);
            }, 10);
        },

        /*
            init
        */
        init: function() {
            win.Imgsrcset.parse();
            win.Imgsrcset.watch();

            Media.listen(win.Imgsrcset.watch);
        }
    }

    if (win.addEventListener) {
        win.addEventListener('load', win.Imgsrcset.init);
    } else {
        win.attachEvent('onload', win.Imgsrcset.init);
    }
})(window);