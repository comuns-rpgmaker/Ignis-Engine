//=============================================================================
// RPG Maker MZ - Ignis Sound Synchronizer
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Ignis Sound Synchronizer
 * @author Reisen (Mauricio Pastana)
 * @help Ignis Sound Synchronizer - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! https://www.patreon.com/raizen884
 * 
 * You can configure the parameters to set if it should be on or off by default, 
 * You can also use plugin commands to change the syncronization whenever you need.
 * I do recommend for synchronization to be on, only when its needed, since it will
 * wait for the audio to synchronize before continuing the images.
 * 
 * You can also create conditions with the following if you do wish to improve
 * your evented scenes:
 * Just create conditions and use the fourth tab, script for this:
 * 
 *  | Ignis.SoundSynchronizer.CanUpdate
 *  | returns true if all audio has been loaded and false if not
 * 
 *  | Ignis.SoundSynchronizer.NeedToSynchronizeBGM
 *  | true if BGM synchronization is true
 * 
 *  | Ignis.SoundSynchronizer.NeedToSynchronizeBGS
 *  | true if BGS synchronization is true
 * 
 * @param syncronizeBGM
 * @type boolean
 * @text Default BGM Syncronization
 * @desc Choose if the bgm needs to be syncronized

 * @param syncronizeBGS
 * @type boolean
 * @text Default BGS Syncronization
 * @desc Choose if the bgs needs to be syncronized

 * @command Syncronize Audio
 * @text Syncronize Audio
 * @desc Choose whether or not to syncronize the Audio with the image.
 * @arg bgm
 * @type boolean
 * @default false
 * @arg bgs
 * @type boolean
 * @default false
 *
 */


// DON'T MODIFY THIS PART!!!
var Ignis = Ignis || {};
Ignis.SoundSynchronizer = Ignis.SoundSynchronizer || {};
Ignis.SoundSynchronizer.VERSION = [1, 0, 0];
Ignis.SoundSynchronizer.CanUpdate = true;
Ignis.SoundSynchronizer.NeedToSynchronizeBGM = false;
Ignis.SoundSynchronizer.NeedToSynchronizeBGS = false;
(() => {

    const pluginName = "IgnisSoundSynchronizer";
    const ignisParameters = PluginManager.parameters(pluginName);

    Ignis.SoundSynchronizer.NeedToSynchronizeBGM = ignisParameters['syncronizeBGM'] == "true" ? true : false;
    Ignis.SoundSynchronizer.NeedToSynchronizeBGS = ignisParameters['syncronizeBGS'] == "true" ? true : false;

    PluginManager.registerCommand(pluginName, "Syncronize Audio", args => {
        const bgm = args['bgm'] == "true" ? true : false;
        const bgs = args['bgs'] == "true" ? true : false;
        Ignis.SoundSynchronizer.NeedToSynchronizeBGM = bgm;
        Ignis.SoundSynchronizer.NeedToSynchronizeBGS = bgm;
    });

    Ignis.SoundSynchronizer.LoadedNewSong = [];
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        if (Ignis.SoundSynchronizer.CanUpdate)
            _Scene_Base_update.call(this, ...arguments);
    };
    const _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function (bgm, pos) {
        if (!this.isCurrentBgm(bgm) && Ignis.SoundSynchronizer.NeedToSynchronizeBGM) {
            Ignis.SoundSynchronizer.LoadedNewSong.push(true);
            Ignis.SoundSynchronizer.CanUpdate = false;
        };
        _AudioManager_playBgm.call(this, ...arguments);
        this._bgmBuffer.setAudioType("bgm");
    };
    const _AudioManager_playBgs = AudioManager.playBgs;

    AudioManager.playBgs = function (bgs, pos) {
        if (!this.isCurrentBgs(bgs) && Ignis.SoundSynchronizer.NeedToSynchronizeBGS) {
            Ignis.SoundSynchronizer.LoadedNewSong.push(true);
            Ignis.SoundSynchronizer.CanUpdate = false;
        }
        _AudioManager_playBgs.call(this, ...arguments);
        this._bgsBuffer.setAudioType("bgs");
    };

    WebAudio.prototype.setAudioType = function (type) {
        this._audioTypeBuffer = type;
    }

    WebAudio.prototype._startPlaying = function (offset) {
        if (this._loopLengthTime > 0) {
            while (offset >= this._loopStartTime + this._loopLengthTime) {
                offset -= this._loopLengthTime;
            }
        }
        this._startTime = WebAudio._currentTime() - offset / this._pitch;
        this._removeEndTimer();
        this._removeNodes();
        this._createPannerNode();
        this._createGainNode();
        this._createAllSourceNodes();
        if (Ignis.SoundSynchronizer.LoadedNewSong.length == 0) {
            this._startAllSourceNodes();
            this._createEndTimer();
        } else {
            this._checkNeedToWait();
        }
    };
    WebAudio.prototype._checkNeedToWait = function () {
        if ((this._audioTypeBuffer == "bgm" && Ignis.SoundSynchronizer.NeedToSynchronizeBGM) ||
            (this._audioTypeBuffer == "bgs" && Ignis.SoundSynchronizer.NeedToSynchronizeBGS))
            Ignis.SoundSynchronizer.LoadedNewSong.pop();
        if (Ignis.SoundSynchronizer.LoadedNewSong.length == 0) {
            AudioManager.continueAllSound();
            Ignis.SoundSynchronizer.CanUpdate = true;
        }
    }
    WebAudio.prototype.syncronizedPlay = function () {
        this._startAllSourceNodes();
        this._createEndTimer();
    };
    AudioManager.continueAllSound = function () {
        if (this._bgmBuffer)
            this._bgmBuffer.syncronizedPlay();
        if (this._bgsBuffer)
            this._bgsBuffer.syncronizedPlay();
    };
})();
