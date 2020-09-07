

//=============================================================================
// RPG Maker MZ - Ignis Touch Pictures
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Ignis Touch Pictures
 * @author Reisen (Mauricio Pastana)

  * @help Ignis Character After Image - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! https://www.patreon.com/raizen884?fan_landing=true
 * You just need to add a listener by a Plugin Command, on it you can configure
 * the parameters, once that is done, that picture will have a listener, which means, whenever
 * you hover/interact with it, it will do what you wanted the listener to do.
 * You can use the other plugin command to remove listeners from pictures.

 * THe blend type is a number, you can follow as below to know what number does what:
* NORMAL: 0
* ADD: 1
* MULTIPLY: 2
* SCREEN: 3
* OVERLAY: 4
* DARKEN: 5
* LIGHTEN: 6
* COLOR_DODGE: 7
* COLOR_BURN: 8
* HARD_LIGHT: 9
* SOFT_LIGHT: 10
* DIFFERENCE: 11
* EXCLUSION: 12
* HUE: 13
* SATURATION: 14
* COLOR: 15
* LUMINOSITY: 16
* NORMAL_NPM: 17
* ADD_NPM: 18
* SCREEN_NPM: 19
* NONE: 20
* SRC_OVER: 0
* SRC_IN: 21
* SRC_OUT: 22
* SRC_ATOP: 23
* DST_OVER: 24
* DST_IN: 25
* DST_OUT: 26
* DST_ATOP: 27
* ERASE: 26
* SUBTRACT: 28
* XOR: 29

 * @command Add Picture Listener
 * @desc Adds a Picture Listener
 * 
 * @arg listener
 * @type struct<PictureListener>

 * @command Remove Picture Listener
 * @desc Removes a PictureListener

 * @arg deletePictureId
 * @type number

 */

/*~struct~PictureListener:
* @param picture Id
* @type number
* @default 1
* @desc Adds a listener to this picture
* @param switch
* @type number
* @default 1
* @desc Switch that will be turned on when this picture is hovered, 0 to disable this.
* @param colorTone
* @type struct<ColorTone>
* @desc The color tone shift when hovered.
* @param opacity
* @type number
* @default 255
* @desc The opacity shift when hovered.
* @param blendType
* @type number
* @default 1
* @desc The type of blend when the picture is hovered.
* @param typeOfEvent
* @type select
* @option common
* @option self
* @desc If the event turned on will be common event or self switch
* @param id
* @type number
* @default 1
* @desc Id of the Common event to be called when the picture is triggered, or the id of the event if it is a self switch "A" is default
* @param triggerType
* @type select
* @option press
* @option repeat
* @option trigger
* @desc The type of trigger you want to put the picture on
* @param onlyPixels
* @type boolean
* @desc If on, hover and trigger/press will work only on actual pixels and not transparent part of the picture.
*/

/*~struct~ColorTone:
* @param red
* @type number
* @default 255
* @desc red color shift 0-255
* @param green
* @type number
* @default 255
* @desc green color shift 0-255
* @param blue
* @type number
* @default 255
* @desc blue color shift 0-255
* @param alpha
* @type number
* @default 255
* @desc alpha color shift 0-255
*/
// NÃO MEXE AQUI POR FAVOR :(!
// No touching this part!
var Ignis = Ignis || {};
Ignis.TouchPictures = Ignis.TouchPictures || {};
Ignis.TouchPictures.VERSION = [1, 0, 1];


const pluginName = "IgnisTouchPictures";
Ignis.TouchPictures.PictureListeners = [];


PluginManager.registerCommand(pluginName, "Add Picture Listener", args => {
    const arg = JSON.parse(args['listener']);
    const id = parseInt(arg["picture Id"]);
    Ignis.TouchPictures.PictureListeners[id] = {
        switch: parseInt(arg["switch"]),
        opacity: parseInt(arg["opacity"]),
        commonEventId: parseInt(arg["id"]),
        colorTone: arg["colorTone"] == "" ? false : JSON.parse(arg["colorTone"]),
        onlyPixels: arg["onlyPixels"] == "true" ? true : false,
        blendType: parseInt(arg["blendType"]),
        triggerType: arg["triggerType"],
        typeEvent: arg["typeOfEvent"]
    }
});

PluginManager.registerCommand(pluginName, "Remove Picture Listener", args => {
    const id = parseInt(args['deletePictureId']);
    Ignis.TouchPictures.PictureListeners[id] = false;
});
(() => {
    //=============================================================================
    // RPG Maker MZ - Ignis Character After Image
    //=============================================================================
    Sprite_Picture.prototype.callIgnisListener = function (pictureId) {
        const listener = Ignis.TouchPictures.PictureListeners[pictureId];
        if (listener.onlyPixels) {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const localPos = this.worldTransform.applyInverse(touchPos);
            if (this.bitmap.getAlphaPixel(localPos.x, localPos.y) == 0) {
                return;
            }
        }
        $gameSwitches.setValue(listener.switch, true);
        this.opacity = listener.opacity;
        if (listener.colorTone) {
            this._colorTone = [parseInt(listener.colorTone.red),
            parseInt(listener.colorTone.green),
            parseInt(listener.colorTone.blue),
            parseInt(listener.colorTone.alpha)];
            this._updateColorFilter();
        }
        this.blendMode = listener.blendType;
        switch (listener.triggerType) {
            case "press":
                if (TouchInput.isPressed()) { this.switchType(listener) }
                break;
            case "trigger":
                if (TouchInput.isTriggered()) { this.switchType(listener) }
                break;
            case "repeat":
                if (TouchInput.isRepeated()) { this.switchType(listener) }
                break;
        }
    }
    Sprite_Picture.prototype.switchType = function (listener) {
        if (listener.typeEvent == "common")
            $gameMap._interpreter.setup($dataCommonEvents[listener.commonEventId].list)
        else {
            const key = [$gameMap.mapId(), listener.commonEventId, "A"];
            $gameSelfSwitches.setValue(key, true);
        }

    };

    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function () {
        _Sprite_Picture_update.call(this, ...arguments);
        if (this._hovered) {
            if (Ignis.TouchPictures.PictureListeners[this._pictureId]) {
                this.callIgnisListener(this._pictureId)
            }
        }
    };
})();

