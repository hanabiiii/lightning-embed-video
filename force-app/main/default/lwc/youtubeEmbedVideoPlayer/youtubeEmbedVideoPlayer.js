import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import YoutubeIframeAPI from '@salesforce/resourceUrl/embedVideo_YoutubeIframeAPI';
import YoutubeWidgetAPI from '@salesforce/resourceUrl/embedVideo_YoutubeWidgetAPI';
import embedVideoAppLogo from '@salesforce/resourceUrl/embedVideoApp_Logo';
import { PlayerState } from 'c/embedVideoUtils';

export default class YoutubeEmbedVideoPlayer extends LightningElement {
    logoSrc = embedVideoAppLogo;

    _videoId;
    get videoId() {
        return this._videoId;
    }
    @api
    set videoId(value) {
        this._videoId = value;

        this.hasError = false;
        this.loadVideoById(value);
    }

    @api autoPlay = false;

    player;
    scriptsLoaded = false;

    hasError = false;
    errorMsg;

    renderedCallback() {
        if (!this.videoId) {
            return;
        }

        if (!this.scriptsLoaded) {
            Promise.all([
                loadScript(this, YoutubeIframeAPI),
                loadScript(this, YoutubeWidgetAPI)
            ])
            .then(() => {
                this.onPlayerLoaded();
            })
            .catch(error => {
                this.onPlayerError(error);
            });
            this.scriptsLoaded = true;
        }
    }

    onPlayerLoaded() {
        const containerElem = this.template.querySelector('.playerWrapper');
        const playerElem = document.createElement('DIV');
        playerElem.className = 'player';
        containerElem.appendChild(playerElem);

        this.player = new window.YT.Player(playerElem, {
            height: '100%',
            width: '100%',
            videoId: this.videoId,
            events: {
                onError: this.onPlayerError.bind(this),
                onStateChange: this.handleOnStateChange.bind(this),
                onReady: this.onPlayerReady.bind(this)
            }
        });
    }

    onPlayerReady() {
        const playerReadyEvent = new CustomEvent('playerready');
        this.dispatchEvent(playerReadyEvent);
        // console.log('opPlayerReady');
    }

    onPlayerError(e) {
        let explanation = '';
        this.hasError = true;

        if (e && e.data === 2) {
            explanation = 'Invalid YouTube ID';
        } else if (e && e.data === 5) {
            explanation = 'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.';
        } else if (e && e.data === 100) {
            explanation = 'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.';
        } else if (e && (e.data === 101 || e.data === 150)) {
            explanation = 'The owner of the requested video does not allow it to be played in embedded players.';
        } else {
            explanation = e;
        }

        this.errorMsg = explanation;
        // console.error('youtube player error:', explanation);
        const data = explanation;
        const stateChangeEvent = new CustomEvent('error', { detail: { data } });
        this.dispatchEvent(stateChangeEvent);
    }

    handleOnStateChange(event) {
        // console.log('onStateChange', event);
        const data = event.data;
        const stateChangeEvent = new CustomEvent('statechange', { detail: { data } });
        this.dispatchEvent(stateChangeEvent);

        if (this.autoPlay && data === PlayerState.CUED) this.player.playVideo();
    }

    // PUBLIC FUNCTIONS

    @api
    loadVideoById(videoId) {
        if (this.player) {
            this.player.loadVideoById(videoId);
        }
    }
    @api
    playVideo() {
        if (this.player) {
            this.player.playVideo();
        }
    }
}