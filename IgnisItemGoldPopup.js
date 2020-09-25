//==========================================================================
// Ignis - Item & Gold Popup
//----------------------------------------------------------------------------
// 09/21/20 | Version: 1.0.0
// This software is released under the zlib License.
//============================================================================

/*:
 * @target MZ
 * @plugindesc Item and Gold Popup v.1.0.0
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884

 * @help Ignis - Item & Gold Popup - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * 
 * Configure all Ignis.ItemAndGoldPopup.parameters for fontsize and colors for each type of item!
 * You can use Plugin Commands to turn the pop-up on and off.
 * The plugin is plug n' play, the moment you use the event command to gain item/gold
 * the pop-up will occur.
 * 
 * 
 * @param switchPopUp
 * @text Switches the pop-up on or off
 * @type boolean
 * @desc Switch either the pop-up on or off.
 * 
 * @param windowWidth
 * @text Window Width
 * @type number
 * @desc Maximum Width of the pop-up window.
 * 
 * @param windowHeight
 * @text Window Height
 * @type number
 * @desc Height of the pop-up window.
 * 
 * @param dynamic
 * @text Dynamic Window Size
 * @type boolean
 * @desc If the window should adjust its size automatically for the text or not.
 * 
 * @param outlineSize
 * @text Font Outline Size
 * @type number
 * @default 1
 * @desc Font outline width, 0 for none.
 * 
 * @param fontSize
 * @text Font Size
 * @type number
 * @default 20
 * @desc Font size on the pop-up.
 * 
 * @param fontName
 * @text Font Name
 * @type text
 * @desc Font Name, if none, it will use the default font of the game.
 * 
 * @param fontColorGold
 * @text Gold Font Color
 * @type text
 * @default FFFFFF
 * @desc Font Color for gold in rgb, Ex: FFFFFF <- white.
 * 
 * @param outlineColorGold
 * @text Gold Outline Color
 * @type text
 * @default FFFFFF
 * @desc Outline Color for gold in rgb, Ex: FFFFFF <- white.
 * 
 * @param fontColorItem
 * @text Item Font Color
 * @type text
 * @default FFFFFF
 * @desc Font Color for Normal Items in rgb, Ex: FFFFFF <- white.

 * @param outlineColorItem
 * @text Item Outline Color
 * @type text
 * @default FFFFFF
 * @desc Outline Color for Normal Items in rgb, Ex: FFFFFF <- white.
 * 
 * @param fontColorWeapon
 * @text Weapon Font Color
 * @type text
 * @default FFFFFF
 * @desc Font Color for Weapons in rgb, Ex: FFFFFF <- white.
 * 
 * @param outlineColorWeapon
 * @text Weapon Outline Color
 * @type text
 * @default FFFFFF
 * @desc Outline Color for Weapons in rgb, Ex: FFFFFF <- white.
 * 
 * @param fontColorEquip
 * @text Equipment Font Color
 * @type text
 * @default FFFFFF
 * @desc Font Color for Equipment in rgb, Ex: FFFFFF <- white.
 * 
 * @param outlineColorEquip
 * @text Equipment Outline Color
 * @type text
 * @default FFFFFF
 * @desc Outline Color for Equipment in rgb, Ex: FFFFFF <- white.
 * 
 * @command switchPopUp
 * @text Switches the pop-up on or off
 * @desc Switch either the pop-up on or off.
 * 
 * @arg switch
 * @type boolean
 * @default true
 * 
 * @command customMessage
 * @text Custom Message
 * @desc Custom Message for the Pop-up
 * 
 * @arg text
 * @type text
*/

// DON'T MODIFY THIS PART!!!
var Ignis = Ignis || {};
Ignis.ItemAndGoldPopup = Ignis.ItemAndGoldPopup || {};
Ignis.ItemAndGoldPopup.VERSION = [1, 0, 2];

(() => {

    const pluginName = "IgnisItemGoldPopup";
    Ignis.ItemAndGoldPopup.parameters = PluginManager.parameters(pluginName);
    Ignis.ItemAndGoldPopup.parameters.switchPopUp = Ignis.ItemAndGoldPopup.parameters.switchPopUp == "true" ? true : false;
    Ignis.ItemAndGoldPopup.parameters.dynamic = Ignis.ItemAndGoldPopup.parameters.dynamic == "true" ? true : false;
    Ignis.ItemAndGoldPopup.parameters.outlineSize = parseInt(Ignis.ItemAndGoldPopup.parameters.outlineSize);
    Ignis.ItemAndGoldPopup.parameters.windowWidth = parseInt(Ignis.ItemAndGoldPopup.parameters.windowWidth);
    Ignis.ItemAndGoldPopup.parameters.windowHeight = parseInt(Ignis.ItemAndGoldPopup.parameters.windowHeight);
    Ignis.ItemAndGoldPopup.active = true;
    //-----------------------------------------------------------------------------
    // PluginManager
    //
    // The static class that manages the plugins.

    PluginManager.registerCommand(pluginName, "switchPopUp", args => {
        Ignis.ItemAndGoldPopup.active = args.switch == "true" ? true : false;
    });

    PluginManager.registerCommand(pluginName, "customMessage", args => {
        $gameParty.addIgnisCustomPopup(args.text);
    });
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _Scene_Map_createDisplayObjects.call(this, ...arguments);
        this.createItemPopupWindow();
    };

    Scene_Map.prototype.createItemPopupWindow = function () {
        this._ignisPopupWindow = new Window_IgnisPopup(new Rectangle(0, 0, Ignis.ItemAndGoldPopup.parameters.windowWidth, Ignis.ItemAndGoldPopup.parameters.windowHeight));
        this.addChild(this._ignisPopupWindow);
        this._ignisPopupWindow.opacity = 0;
        this._ignisPopupWindow.close();
    };
    const _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function () {
        const enabled = _Scene_Map_isMenuEnabled.call(this, ...arguments);
        return enabled && !$gameParty.hasItemPopUp();
    };

    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        const canMove = _Game_Player_canMove.call(this, ...arguments);
        return canMove && !$gameParty.hasItemPopUp();
    };
    // Change Gold
    const _Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
    Game_Interpreter.prototype.command125 = function (params) {
        _Game_Interpreter_command125.call(this, ...arguments);
        const value = this.operateValue(params[0], params[1], params[2]);
        $gameParty.addIgnisPopUp(false, value);
        return true;
    };

    // Change Items
    const _Game_Interpreter_command126 = Game_Interpreter.prototype.command126;
    Game_Interpreter.prototype.command126 = function (params) {
        _Game_Interpreter_command126.call(this, ...arguments);
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.addIgnisPopUp($dataItems[params[0]], value);
        return true;
    };

    // Change Weapons
    const _Game_Interpreter_command127 = Game_Interpreter.prototype.command127;
    Game_Interpreter.prototype.command127 = function (params) {
        _Game_Interpreter_command127.call(this, ...arguments);
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.addIgnisPopUp($dataWeapons[params[0]], value, params[4]);
        return true;
    };

    // Change Armors
    const _Game_Interpreter_command128 = Game_Interpreter.prototype.command128;
    Game_Interpreter.prototype.command128 = function (params) {
        _Game_Interpreter_command128.call(this, ...arguments);
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.addIgnisPopUp($dataArmors[params[0]], value, params[4]);
        return true;
    };

    Game_Party.prototype.addIgnisPopUp = function (item, amount) {
        if (Ignis.ItemAndGoldPopup.active)
            this._ignisPopUp.push([item, amount]);
    };

    Game_Party.prototype.addIgnisCustomPopup = function (text) {
        this._ignisPopUp.push([text]);
    };


    const _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function (amount) {
        _Game_Party_gainGold.call(this, ...arguments);
    };
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function () {
        _Game_Party_initialize.call(this, ...arguments);
        this._ignisPopUp = new Array();
    };
    Game_Party.prototype.hasItemPopUp = function () {
        return this._ignisPopUp.length > 0;
    };
    Game_Party.prototype.firstItemPopUp = function () {
        return this._ignisPopUp[0];
    };
    Game_Party.prototype.unloadItemPopUp = function () {
        this._ignisPopUp.shift();
    };
    //-----------------------------------------------------------------------------
    // Window_IgnisPopup
    //
    // Window class for item and gold pop-ups.

    function Window_IgnisPopup() {
        this.initialize(...arguments);
    }

    Window_IgnisPopup.prototype = Object.create(Window_Base.prototype);
    Window_IgnisPopup.prototype.constructor = Window_IgnisPopup;
    Window_IgnisPopup.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._time = 0;
    };


    Window_IgnisPopup.prototype.configureFont = function (item) {
        this.contents.fontFace = Ignis.ItemAndGoldPopup.parameters.fontName ? Ignis.ItemAndGoldPopup.parameters.fontName : $gameSystem.mainFontFace();
        this.contents.fontSize = Ignis.ItemAndGoldPopup.parameters.fontSize;
        this.contents.outlineWidth = Ignis.ItemAndGoldPopup.parameters.outlineSize;
        if (item[0] && item.length == 1) {
            this.changeTextColor(ColorManager.systemColor());
            this.changeOutlineColor(ColorManager.outlineColor());
        } else if (item[0]) {
            if (DataManager.isItem(item[0])) {
                this.changeTextColor("#".concat(Ignis.ItemAndGoldPopup.parameters.fontColorItem));
                this.changeOutlineColor("#".concat(Ignis.ItemAndGoldPopup.parameters.outlineColorItem));
            } else if (DataManager.isWeapon(item[0])) {
                this.changeTextColor("#".concat(Ignis.ItemAndGoldPopup.parameters.fontColorWeapon));
                this.changeOutlineColor("#".concat(Ignis.ItemAndGoldPopup.parameters.outlineColorWeapon));
            } else if (DataManager.isArmor(item[0])) {
                this.changeTextColor("#".concat(Ignis.ItemAndGoldPopup.parameters.fontColorEquip));
                this.changeOutlineColor("#".concat(Ignis.ItemAndGoldPopup.parameters.outlineColorEquip));
            }

        } else {
            this.changeTextColor("#".concat(Ignis.ItemAndGoldPopup.parameters.fontColorGold));
            this.changeOutlineColor("#".concat(Ignis.ItemAndGoldPopup.parameters.outlineColorGold));
        }
    };

    Window_IgnisPopup.prototype.refresh = function () {
        this.contents.clear();
        const item = $gameParty.firstItemPopUp();
        this.configureFont(item);
        let text;
        let width = ImageManager.iconWidth;
        if (item[0] && item.length == 1) {
            text = item[0];
            width = -4;
        }
        else if (item[0]) {
            this.drawIcon(item[0].iconIndex, 0, 0);
            text = "x".concat(item[1]).concat(" ").concat(item[0].name);
        } else {
            this.drawIcon(208, 0, 0);
            text = "x".concat(item[1]).concat(" ").concat("Gold");
        }
        this.contents.drawText(text, width + 4, 0, Ignis.ItemAndGoldPopup.parameters.windowWidth - ImageManager.iconWidth - 4 - this.padding * 2 - Ignis.ItemAndGoldPopup.parameters.outlineSize, this.height - 24, "left");
        this.measureContentsWidth(width, text);
    };
    Window_IgnisPopup.prototype.measureContentsWidth = function (originalWidth, text) {
        let width = this.contents.measureTextWidth(text);
        width += originalWidth + 4 + this.padding * 2 + Ignis.ItemAndGoldPopup.parameters.outlineSize;
        if (Ignis.ItemAndGoldPopup.parameters.dynamic)
            this.width = Math.ceil(width);
    };


    Window_IgnisPopup.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if ($gameParty.hasItemPopUp()) { this.callPopup() }
    };

    Window_IgnisPopup.prototype.callPopup = function () {
        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            SoundManager.playOk();
            $gameParty.unloadItemPopUp();
            if ($gameParty.hasItemPopUp()) {
                this.refresh();
            } else {
                this.close();
            }
        }
        this.x = $gamePlayer.screenX() - this.width / 2;
        this.y = $gamePlayer.screenY() - 100;
        if (this.isClosed()) {
            this.opacity = 255;
            this.refresh();
            this.open();
        }
    };
})();