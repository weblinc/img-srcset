/* imgsrcset - Img srcset polyfill for resolution responsive images. Authors & copyright (c) 2012: WebLinc, David Knight. */
/* NOTE: Depends on Media object. See https://github.com/weblinc/media-match */

// Imgsrcset
(function(win) {
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
                    media       : srcset
                                        /*.replace(/\b(\d+)w\b/g, '(max-width: $1)')
                                        .replace(/\b(\d+)h\b/g, '(max-height: $1)')
                                        .replace(/\b(\d+(\.\d*)?)x\b/g, '(resolution: $1dppx)')
                                        .replace(/\)\s*\(/g, ') and (')*/,
                    matches     : false
                });

                _srcsetl++;
            } while(imgsl--);
        },

        /*
            parseMatch
        */
        parseMatch: function(srcset) {
            //return false;
            var srcsetList  = srcset.replace(/\s*,\s*/, ',').split(','),
                srcsetl     = srcsetList.length,
                mql         = {src: '', media: '', matches: false},
                match       = true;

            while (srcsetl--) {
                var t   = srcsetList[srcsetl].match(/[^\s]+/g),
                    tl  = t.length;

                match = true;

                while (tl--) {
                    if (tl === 0) {
                        mql.src = t[tl];
                    } else {
                        var prop        =   (t[tl].indexOf('w') !== -1 && 'width') || 
                                            (t[tl].indexOf('h') !== -1 && 'height') || 
                                            (t[tl].indexOf('x') !== -1 && 'resolution'),
                            digits      = t[tl].match(/\d+/)[0],
                            feature     = Media.features[prop],
                            absValue    = Media.getAbsValue(digits + ((prop === 'resolution' && 'dppx') || ''));

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
                    var srcset  = Imgsrcset.srcsets[id],
                        match   = false;

                    if (typeof srcset === 'undefined') { continue; }

                    match = Imgsrcset.parseMatch(srcset.media);

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