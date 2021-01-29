({
	initContainerStyles : function(cmp) {
		var styles = '';
		var height = cmp.get('v.height');
        var width = cmp.get('v.width');
        
        styles += height > 0 ? 'height: ' + height + 'px;' : 'height: 100%';
        styles += width > 0 ? 'width: ' + width + 'px;' : 'width: 100%';

        cmp.set('v.containerStyles', styles);
	},
    /*
     * command: playVideo, pauseVideo, stopVideo
     */
    commandYoutubeVideo: function(cmp, command) {
        var iframePlayer = document.getElementById('youtubePlayer');
        //console.log('youtubePlayer', iframePlayer);
        try {
            iframePlayer.contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': command,
                'args': []
            }), "*");
        } catch (err) {
            console.log(err);
        }
    }
})