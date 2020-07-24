import React, {Component, useState} from 'react'; // let's also import Component
import QuestionDialog, {QuestionType} from "./QuestionDialog";
import {
    create,
    isPlayerSupported,
    MediaPlayer,
    PlayerError,
    PlayerEventType,
    PlayerState,
    Quality,
    TextCue,
    TextMetadataCue,
} from 'amazon-ivs-player';
/**
 * These imports are loaded via the file-loader, and return the path to the asset.
 * We use the TypeScript compiler (TSC) to check types; it doesn't know what this WASM module is, so let's ignore the error it throws (TS2307).
 */
// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm'
// @ts-ignore
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';
import {bool} from "aws-sdk/clients/signer";
import {IGenericDialogState} from "./GenericDialog";
import {string} from "prop-types";
import {stringify} from "qs";
import {CueQuestionType} from "./PlayerCueTypes";

interface ReturnCallable {
    (...args: any): any
}

interface CueMetadataHandler {
    (cue: TextMetadataCue): any
}

interface StateHandler {
    (state: string): any
}

class PlayerDemo {
    private player: MediaPlayer;
    // @ts-ignore
    private videoElement: HTMLVideoElement = document.querySelector('#video-player');

    constructor(player: MediaPlayer) {
        this.player = player;
        player.attachHTMLVideoElement(this.videoElement);
        this.attachListeners();

        // @ts-ignore
        const versionString: HTMLElement = document.querySelector('.version');
        versionString.innerText = `Amazon IVS Player version ${player.getVersion()}`;
    }

    loadAndPlay(stream: string) {
        const {player} = this;
        /**
         * With setAutoplay, we don't need to call play() here to try and start the stream. One of three things will happen:
         * - Autoplay with sound
         * - Autoplay muted
         * - Playback blocked
         * If autoplay is muted or blocked, the viewer will need to manually interact with the video player in order to unmute or start playback.
         * See https://developers.google.com/web/updates/2017/09/autoplay-policy-changes for more info on autoplaying video and best practices.
         * */
        player.setAutoplay(true);
        player.load(stream);
    }

    destroy() {
        // Event listeners are automatically removed on player destruction
        this.player.delete();
    }

    addStateHandler(listener: StateHandler) {
        const {player} = this;
        for (let state of Object.values(PlayerState)) {
            player.addEventListener(state, () => {
                listener(state);
            });
        }
    }

    addCueMetadataHandler(listener: CueMetadataHandler) {
        const {player} = this;
        player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue: TextMetadataCue) => {
            console.log('Timed metadata', cue.text);
            listener(cue);
        });
    }

    attachListeners() {
        const {player} = this;
        for (let state of Object.values(PlayerState)) {
            player.addEventListener(state, () => {
                console.log(state);
            });
        }

        player.addEventListener(PlayerEventType.INITIALIZED, () => {
            console.log('INITIALIZED');
        });

        player.addEventListener(PlayerEventType.ERROR, (error: PlayerError) => {
            console.error('ERROR', error);
        });

        player.addEventListener(PlayerEventType.QUALITY_CHANGED, (quality: Quality) => {
            console.log('QUALITY_CHANGED', quality);
        });

        // This event fires when text cues are encountered, such as captions or subtitles
        player.addEventListener(PlayerEventType.TEXT_CUE, (cue: TextCue) => {
            console.log('TEXT_CUE', cue.startTime, cue.text);
        });

        // This event fires when embedded Timed Metadata is encountered
        player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue: TextMetadataCue) => {
            console.log('Timed metadata', cue.text);
        });
    }
}

type PlayerDemoProps = {
    title: string
}

type PlayerDemoState = {
    currentQuestion?: QuestionType | undefined,
    lastCue: CueQuestionType | undefined,
    playerReady: bool,
    lastState
        : string | undefined,
    showQuestion: bool
}

export default class PlayerDemoComponent extends Component<PlayerDemoProps, PlayerDemoState> {

    private defaultStream = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8';

    private demo: PlayerDemo | null = null;
    private inputEl: HTMLInputElement | null = null;

    public state: PlayerDemoState = {
        lastCue: undefined,
        currentQuestion: undefined,
        playerReady: false,
        lastState: undefined,
        showQuestion: false
    };

    componentDidMount = () => this.setup()

    setup() {
        // @ts-ignore
        this.setState({
            showQuestion: false,
            currentQuestion: undefined
        })
        /**
         * The IVS player can only be used in browsers which support WebAssembly.
         * You should use `isPlayerSupported` before calling `create`.
         * Otherwise, wrap `create` in a `try/catch` block, because an error will be thrown in browsers without WebAssembly support.
         */
        if (isPlayerSupported) {
            // setupForm();
            this.setupPlayer();
        } else {
            console.error('IVS Player is not supported in this browser');
        }
    }

    setupPlayer() {
        const createAbsolutePath = (assetPath: string) => new URL(assetPath, document.URL).toString();
        const player = create({
            wasmWorker: createAbsolutePath(wasmWorkerPath),
            wasmBinary: createAbsolutePath(wasmBinaryPath),
        });

        this.demo = new PlayerDemo(player);
        this.demo.addStateHandler(this.onStateChanged.bind(this));
        this.loadFormStream();

        /**
         * Add the demo and player to the window so that you can play around with them in the console.
         * This is not necessary for production.
         * */
        // @ts-ignore
        window.demo = this.demo;
        // @ts-ignore
        window.player = this.demo.player;
    }

    loadFormStream() {
        if (this.demo !== null) {
            this.demo.loadAndPlay(this.defaultStream)
        }
    }

    private onMetadataCue(cue: TextMetadataCue): void {


        const lastCue = Object.assign({}, {...cue})
        const parsed = JSON.parse(lastCue.text);
        const currentQuestion = Object.assign({}, {...parsed})
        console.log('onMetadataCue - lastCue', lastCue)
        console.log('onMetadataCue - currentQuestion', currentQuestion)
        // @ts-ignore
        this.setState({
            ...this.state,
            showQuestion: true,
            lastCue,
            currentQuestion
        })
    }

    private onStateChanged(lastState: string) {
        console.log('onStateChanged', lastState, this.demo)
        this.setState({lastState})
        if (lastState === PlayerState.READY) {
            this.setState({playerReady: true})
            // @ts-ignore
            this.demo.addCueMetadataHandler(this.onMetadataCue.bind(this));
        }
    }

    private onCloseDialog() {
        this.setState({showQuestion: false})
    }

    render() {
        return <>
            <div>{this.props.title}</div>
            <div className="demo">
                <div className="video-container">
                    <form className="src-container-direct" style={{display: 'none'}}>
                        <input className="src-input" placeholder="Enter IVS .m3u8"/>
                        <button className="src-submit" type="submit">Load</button>
                    </form>
                    <video id="video-player" playsInline></video>
                    <div className='version'></div>
                </div>
                {this.state.currentQuestion &&
                this.state.showQuestion && <QuestionDialog isOpen={true}
                                                           title={'New question'}
                                                           onSkip={this.onCloseDialog.bind(this)}
                                                           question={this.state.currentQuestion}/>}
            </div>
        </>
    }
}