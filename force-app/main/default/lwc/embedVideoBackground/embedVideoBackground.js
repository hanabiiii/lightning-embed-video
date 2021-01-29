import { LightningElement, api, track } from 'lwc';

export default class EmbedVideoBackground extends LightningElement {

    @api embedVideoType = 'youtube';
    @api videoId;

    @api height = 300;
    @api width = 300;

    connectedCallback() {

    }

    // STYLE EXPRESSIONS
    get youtubeEmbedType() {
        return this.embedVideoType === 'youtube';
    }

    get youtubeEmbedSrc() {
        return `https://www.youtube.com/embed/${this.videoId}?autoplay=1&controls=0&enablejsapi=1&loop=1`;
    }

    get containerStyles() {
        let s = '';

        s += this.height > 0 ? `height: ${this.height}px;` : 'height: 100%';
        s += this.width > 0 ? `width: ${this.width}px;` : 'width: 100%';

        return s;
    }


    // PUBLIC FUNCTIONS
    @api
    playVideo() {
        if (this.youtubeEmbedType) {
            this.commandYoutubeVideo();
        }
    }
    @api
    pauseVideo() {
        if (this.youtubeEmbedType) {
            this.commandYoutubeVideo('pauseVideo');
        }
    }


    /*
     * command: playVideo, pauseVideo, stopVideo
     */
    commandYoutubeVideo(command = 'playVideo') {
        var iframePlayer = this.template.querySelector('.youtubePlayer');
        console.log('youtubePlayer', iframePlayer);
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
}