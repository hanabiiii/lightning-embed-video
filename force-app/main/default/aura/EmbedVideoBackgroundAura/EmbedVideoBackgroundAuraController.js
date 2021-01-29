({
	doInit: function(cmp, event, helper) {
        if (cmp.get('v.embedVideoType') === 'youtube') {
            var videoId = cmp.get('v.videoId');
            var youtubeEmbedSrc = 'https://www.youtube.com/embed/' + videoId + '?playlist=' + videoId
            					+ '&autoplay=1&controls=0&loop=1&showinfo=0&rel=0&enablejsapi=1';
            cmp.set('v.youtubeEmbedSrc', youtubeEmbedSrc);
        }
        
        helper.initContainerStyles(cmp);
	},
    handlePauseVideo: function(cmp, event, helper) {
        if (cmp.get('v.embedVideoType') === 'youtube') {
            helper.commandYoutubeVideo(cmp, 'pauseVideo');
        }
        
    },
    handlePlayVideo: function(cmp, event, helper) {
        if (cmp.get('v.embedVideoType') === 'youtube') {
            helper.commandYoutubeVideo(cmp, 'playVideo');
        }
        
    }
})