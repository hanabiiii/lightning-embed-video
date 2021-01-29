import { LightningElement, api, track } from 'lwc';
import getYoutubePlaylistInfo from '@salesforce/apex/EmbedVideoSettingController.getYoutubePlaylistInfo';
import { reduceErrors, PlayerState } from 'c/embedVideoUtils';
import embedVideoAppLogo from '@salesforce/resourceUrl/embedVideoApp_Logo';

export default class YoutubeEmbedVideo extends LightningElement {
    @api isCommunity = false;

    @api embedType = 'video';
    @api videoId = '';
    @api playlistId = '';
    @api playlistTitle = '';
    @api videoType = 'container';
    @api maxResults = 5;
    @api showToolBar = 1;

    @track pageInfo = {};
    @track playlistItems = [];
    @track currentItemId = '';
    @track currentItem = {};
    @track nextPageToken = '';

    @track isLoading = false;
    @track showVideoModal = false;
    @track embedVideoURL = '';

    @track isLoopEnabled = false;
    @track currentVideoState;

    @track hasError = false;
    @track errorMessage = '';

    connectedCallback() {
        this.refreshComponentInfo();
    }

    // STYLE EXPRESSIONS

    get containerClass() {
        let c = 'youtube-embed-video_container';

        c += this.isCommunity ? '' : ' slds-card';

        return c;
    }
    get wrapperClass() {
        let c= '';

        c += this.isCommunity ? '' : ' slds-card__body slds-m-top_none slds-m-bottom_none';

        return c;
    }

    get videoModalClass() {
        let c = 'slds-modal';

        if (this.showVideoModal) {
            c += ' slds-fade-in-open';
        } else {
            c += ' slds-fade-in-close';
        }
        return c;
    }
    get videoBackdropModalClass() {
        let c = 'slds-backdrop';

        if (this.showVideoModal) {
            c += ' slds-backdrop_open';
        } else {
            c += ' slds-backdrop_close';
        }
        return c;
    }

    get videoEmbedType() {
        return this.embedType === 'video';
    }
    get playlistEmbedType() {
        return this.embedType === 'playlist';
    }

    get containerVideoType() {
        return this.videoType === 'container';
    }
    get modalVideoType() {
        return this.videoType === 'modal';
    }

    get isPlaylistTitleEmpty() {
        return this.playlistTitle && this.playlistTitle.length > 0 ? false : true;
    }

    get canLoadMore() {
        return this.playlistItems.length < this.pageInfo.totalResults;
    }

    // EVENT HANDLING

    handleSelectPlaylistItem(event) {
        event.preventDefault();
        this.currentItemId = event.target.dataset.id;
        this.currentItem = this.playlistItems.filter(i => i.id === this.currentItemId)[0];

        if (this.containerVideoType) {
            this.updateActivePlaylistItem();
            // console.log(JSON.parse(JSON.stringify(this.playlistItems)));
        } else {
            this.handleShowVideoModal();
        }

        if (this.currentItem) {
            const videoId = this.currentItem.snippet.resourceId.videoId;
            this.videoId = videoId;
        }
    }

    handleShowVideoModal() {
        this.showVideoModal = true;
    }

    handleCloseVideoModal() {
        this.showVideoModal = false;
    }

    handleToggleLoop() {
        this.isLoopEnabled = !this.isLoopEnabled;
    }

    handleShowErrorMessage(showError, errorMessage = '') {
        this.hasError = showError;
        this.errorMessage = errorMessage;
    }

    handleOnStateChange(event) {
        const state = event.detail && event.detail.data ? event.detail.data : -1;
        // console.log('onStateChange', event, state);
        
        if ((this.currentVideoState === PlayerState.PLAYING && state === PlayerState.UNSTARTED)
            || state === PlayerState.ENDED) {
            // do end state
            this.currentVideoState = state;

            if (this.isLoopEnabled) this.handleLoop();
        } else {
            this.currentVideoState = state;
        }
    }

    // INTERNAL FUNCTIONS

    retrieveVideoInfo() {
        if (this.videoId) {
            // this.configVideoIframe(this.videoId);
        } else {
            let errorMsg = 'videoId is required';
            // console.error(errorMsg);
            this.handleShowErrorMessage(true, errorMsg);
        }
    }

    retrievePlaylistInfo() {
        this.handleShowErrorMessage(false);

        if (this.playlistId) {
            this.isLoading = true;
            getYoutubePlaylistInfo({ playlistId: this.playlistId, maxResults: this.maxResults  })
            .then(data => {
                // console.log('getYoutubePlaylistInfo', res);
                this.isLoading = false;
                data = JSON.parse(data);
                this.updatePlaylistData(data, true);
                // console.log('getYoutubePlaylistInfo', data);
            })
            .catch(error => {
                let errorMsg = reduceErrors(error).join(', ');
                // console.error('getYoutubePlaylistInfo', errorMsg);
                this.handleShowErrorMessage(true, errorMsg);
                this.isLoading = false;
            });
        } else {
            let errorMsg = 'playlistId is required';
            // console.error(errorMsg);
            this.handleShowErrorMessage(true, errorMsg);
        }
    }

    retrieveMorePlaylistInfo() {
        this.handleShowErrorMessage(false);

        if (this.nextPageToken) {
            this.isLoading = true;
            getYoutubePlaylistInfo({ playlistId: this.playlistId, maxResults: this.maxResults, pageToken: this.nextPageToken })
            .then(data => {
                this.isLoading = false;
                // console.log('getYoutubePlaylistInfo', res);
                data = JSON.parse(data);
                this.updatePlaylistData(data);
                // console.log('getYoutubePlaylistInfo', data);
            })
            .catch(error => {
                let errorMsg = reduceErrors(error).join(', ');
                // console.error('getYoutubePlaylistInfo', errorMsg);
                this.handleShowErrorMessage(true, errorMsg);
                this.isLoading = false;
            });
        }
    }

    handleLoop() {
        if (this.playlistEmbedType) {
            const currentItem = this.playlistItems.filter(i => i.id === this.currentItemId)[0];
            const currentItemIndex = this.playlistItems.lastIndexOf(currentItem);
            
            if (this.nextPageToken && currentItemIndex === this.playlistItems.length - 1) { // load more playlist and play
                this.isLoading = true;
                getYoutubePlaylistInfo({ playlistId: this.playlistId, maxResults: this.maxResults, pageToken: this.nextPageToken })
                .then(data => {
                    this.isLoading = false;
                    // console.log('getYoutubePlaylistInfo', res);
                    data = JSON.parse(data);
                    this.updatePlaylistData(data);
                    // console.log('getYoutubePlaylistInfo loop', data);

                    const nextItem = data.items[0];
                    this.currentItem = nextItem;
                    this.currentItemId = nextItem.id;
                    this.videoId = nextItem.snippet.resourceId.videoId;
                    this.updateActivePlaylistItem();
                })
                .catch(error => {
                    let errorMsg = reduceErrors(error).join(', ');
                    // console.error('getYoutubePlaylistInfo', errorMsg);
                    this.handleShowErrorMessage(true, errorMsg);
                    this.isLoading = false;
                });
            } else { // play the next video
                const nextItemIndex = (currentItemIndex <= this.playlistItems.length - 2) ? currentItemIndex + 1 : 0;
                const nextItem = this.playlistItems[nextItemIndex];
                // console.log('next item', nextItemIndex, {...nextItem});

                this.currentItem = nextItem;
                this.currentItemId = nextItem.id;
                this.videoId = nextItem.snippet.resourceId.videoId;
                this.updateActivePlaylistItem();
            }
        } else {
            // video loop
            const player = this.template.querySelector('c-youtube-embed-video-player');
            if (player) player.playVideo();
        }

    }

    handleOnErrorVideo(event) {
        console.log('onError', event);
        if (this.isLoopEnabled) this.handleLoop();
    }

    updateActivePlaylistItem() {
        const playlistItems = this.playlistItems.map((i) => {
            i.active = i.id === this.currentItemId;
            return i;
        });
        this.playlistItems = JSON.parse(JSON.stringify(playlistItems));
    }
    updatePlaylistData(data, refresh = false) {
        this.pageInfo = data.pageInfo ? data.pageInfo : {};
        if (data && data.items) {
            data.items = data.items.map(item => {
                // default thumbnail
                if (!(item.snippet && item.snippet.thumbnails && item.snippet.thumbnails.default && item.snippet.thumbnails.default.url)) {
                    item.snippet.thumbnails = {
                        default: {
                            url: embedVideoAppLogo
                        }
                    }
                }
                return item;
            })
        }
        this.playlistItems = data.items ? (refresh ? data.items : this.playlistItems.concat(data.items)) : [...this.playlistItems];
        this.nextPageToken = data.nextPageToken;
    }

    @api
    refreshComponentInfo() {
        this.handleShowErrorMessage(false);

        if (this.videoEmbedType) {
            this.retrieveVideoInfo();
        } else if (this.playlistEmbedType) {
            this.videoId = '';
            this.retrievePlaylistInfo();
        }
    }
}