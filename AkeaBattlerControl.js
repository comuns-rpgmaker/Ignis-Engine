
//==========================================================================
// Akea - Extra Battler Control
//----------------------------------------------------------------------------
// 09/07/20 | Version: 1.0.0
// This software is released under the zlib License.
//============================================================================

/*:
 * @target MZ
 * @plugindesc Akea Extra Battler Control
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * @base AkeaAnimatedBattleSystem
 * @orderAfter AkeaAnimatedBattleSystem
 * 
 * @help Akea Battler After Image - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 

 * Battle System Akea Battler After Image works on :
 * - Akea Animated Battle System
 * 
 * This plugin will allow extra controls of battlers (user or target) with,
 * scale/rotation/opacity. It gives extra sequences to improve your control over these things.
 * Below each notetag and what it does
 * Skill Notes Tag:
 *   <akeaRotateUser>
 *   rotation: number
 *   time: number (optional, 30 is default if not configured)
 *   anchor: number (optional, 1 is default)
 *   reset: true/false (optional)
 *   </akeaRotateUser>
 *       | Rotates Battler - User of the Skill.
 *       | rotation: in angles, 180 rotates in a half rotation clockwise, -360 a full rotation counter-clockwise
 *       | time: the duration of the movement
 *       | anchor: where the rotation takes place, 1 is bottom, 0.5 center, 0 top, you can choose 0.3 for example. Recommended is always 0.5
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.
 *   <akeaRotateTarget>
 *   rotation: number
 *   time: number (optional, 30 is default if not configured)
 *   anchor: number (optional, 1 is default)
 *   reset: true/false (optional)
 *   </akeaRotateTarget>
 *       | Rotates Battler - Target of the Skill.
 *       | rotation: in angles, 180 rotates in a half rotation clockwise, -360 a full rotation counter-clockwise
 *       | time: the duration of the movement
 *       | anchor: where the rotation takes place, 1 is bottom, 0.5 center, 0 top, you can choose 0.3 for example. Recommended is always 0.5
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.

 *   <akeaScaleUser>
 *   scalex: number (optional, 1 is default)
 *   scaley: number (optional, 1 is default)
 *   time: number (optional, 30 is default if not configured)
 *   anchor: number (optional, 1 is default)
 *   reset: true/false (optional)
 *   </akeaScaleUser>
 *       | Scale Battler - User of the Skill.
 *       | scalex/scaley: how much the battler will scale in X and Y, 1 is normal 0.5 would be half for example.
 *       | time: the duration of the movement
 *       | anchor: where the rotation takes place, 1 is bottom, 0.5 center, 0 top, you can choose 0.3 for example. Recommended is always 0.5
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.
 *   <akeaScaleTarget>
 *   scalex: number (optional, 1 is default)
 *   scaley: number (optional, 1 is default)
 *   time: number (optional, 30 is default if not configured)
 *   anchor: number (optional, 1 is default)
 *   reset: true/false (optional)
 *   </akeaScaleTarget>
 *       | Scale Battler - Target of the Skill.
 *       | scalex/scaley: how much the battler will scale in X and Y, 1 is normal 0.5 would be half for example.
 *       | time: the duration of the movement
 *       | anchor: where the rotation takes place, 1 is bottom, 0.5 center, 0 top, you can choose 0.3 for example. Recommended is always 0.5
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.

 *   <akeaOpacityUser>
 *   opacity: number 
 *   time: number (optional, 30 is default if not configured)
 *   reset: true/false (optional)
 *   </akeaOpacityUser>
 *       | Scale Battler - User of the Skill.
 *       | opacity: how will the opacity be at the end of the movement, 255 is full image, 0 is transparent
 *       | time: the duration of the movement
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.
 *   <akeaOpacityTarget>
 *   opacity: number 
 *   time: number (optional, 30 is default if not configured)
 *   reset: true/false (optional)
 *   </akeaOpacityTarget>
 *       | Scale Battler - User of the Skill.
 *       | opacity: how will the opacity be at the end of the movement, 255 is full image, 0 is transparent
 *       | time: the duration of the movement
 *       | reset: at the end resets to default, I recommend this option at the end of all action sequences.
 */


 // DON'T MODIFY THIS PART!!!
var Akea = Akea || {};
Akea.BattlerControl = Akea.BattlerControl || {};
Akea.BattlerControl.VERSION = [1, 0, 0];

if (!Akea.BattleSystem) throw new Error("Akea Battler Control plugin needs the Akea Animated Battle System base.");
if (Akea.BattleSystem.VERSION < [1, 1, 0]) throw new Error("Akea Battler Control plugin only works with versions 1.1.0 or higher of the Akea Animated Battle System.");

(() => {
    const akea_Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function () {
        akea_Sprite_Battler_updatePosition.call(this, ...arguments);
        if (this.mainSprite()) {
            this.updateAkeaBattlerControl();
        }
    };
    Sprite_Battler.prototype.updateAkeaBattlerControl = function () {
        if (this._updateAkeaBCTime > 0) {
            this._updateAkeaBCTime--;
            this.updateAkeaBCRotation();
            if (this._updateAkeaBCTime == 0 && this._updateAkeaBCRotationReset) {
                this.mainSprite().rotation = 0;
                this.mainSprite().anchor.y = 1;
            }
        }
        if (this._updateScaleBCTime > 0) {
            this._updateScaleBCTime--;
            this.updateAkeaScale();
            if (this._updateScaleBCTime == 0 && this._updateAkeaBCScaleReset) {
                this.mainSprite().scale.x = 1;
                this.mainSprite().scale.y = 1;
                this.mainSprite().anchor.y = 1;
            }
        }
        if (this._updateOpacityBCTime > 0) {
            this._updateOpacityBCTime--;
            this.updateAkeaOpacity();
            if (this._updateScaleBCTime == 0 && this._updateAkeaBCOpacityReset) {
                this.opacity = 255;
            }
        }
        this.mainSprite().y = (this.mainSprite().anchor.y - 1) * this.mainSprite().height;
    }

    const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function () {
        _Sprite_Battler_updatePosition.call(this, ...arguments);
        if (this.mainSprite())
            this._zIndex -= this.mainSprite().y;
    };
    Sprite_Battler.prototype.updateAkeaBCRotation = function () {
        this.mainSprite().rotation += this._akeaRotateBattlerSpeed;
        if (this.mainSprite().rotation <= 2 * -Math.PI) {
            this.mainSprite().rotation += 2 * Math.PI;
        } else if (this.mainSprite().rotation >= 2 * Math.PI) {
            this.mainSprite().rotation -= 2 * Math.PI;
        }
    }
    Sprite_Battler.prototype.updateAkeaScale = function () {
        this.mainSprite().scale.x += this._AkeaEndScaleX;
        this.mainSprite().scale.y += this._AkeaEndScaleY;
    }
    Sprite_Battler.prototype.updateAkeaOpacity = function () {
        this.opacity += this._AkeaEndOpacity;
    }


    const _Sprite_Battler_initialize = Sprite_Battler.prototype.initialize;
    Sprite_Battler.prototype.initialize = function (battler) {
        _Sprite_Battler_initialize.call(this, ...arguments);
        this._updateAkeaBCTime = 0;
        this._updateScaleBCTime = 0;
    };

    const _battlerControl_Game_Battler_callAkeaActions = Game_Battler.prototype.callAkeaActions
    Game_Battler.prototype.callAkeaActions = function (actionName, parameters, action, targets) {
        _battlerControl_Game_Battler_callAkeaActions.call(this, ...arguments);
        let regex = /(\w+):\s*([^\s]*)/gm;
        let obj = {};
        let id = false;
        do {
            param = regex.exec(parameters);
            if (param) {
                if (RegExp.$1 == "id") {
                    id = parseInt(RegExp.$2);
                } else {
                    obj[RegExp.$1] = RegExp.$2;
                }
            }
        } while (param);
        if (!id) { id = 1 };
        if (actionName == "RotateUser") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        } else if (actionName == "RotateTarget") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        } else if (actionName == "ScaleUser") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        } else if (actionName == "ScaleTarget") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        } else if (actionName == "OpacityUser") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        } else if (actionName == "OpacityTarget") {
            this._akeaAnimatedBSActions.addCustomAddon(id, targets, actionName, this, action, obj);
        }
    }
    const _battlerControl_Sprite_Battler_manageAkeaActions = Sprite_Battler.prototype.manageAkeaActions
    Sprite_Battler.prototype.manageAkeaActions = function (action) {
        _battlerControl_Sprite_Battler_manageAkeaActions.call(this, ...arguments);
        const obj = action.getObject();
        switch (action.getActionType()) {
            case "RotateUser":
                this._updateAkeaBCTime = parseInt(obj["time"]) || 30;
                const endAkeaBCPosition = Math.PI * (parseInt(obj["rotation"]) / 180) - this.mainSprite().rotation;
                this._akeaRotateBattlerSpeed = endAkeaBCPosition / this._updateAkeaBCTime;
                this.mainSprite().anchor.y = parseFloat(obj["anchor"]) || 1;
                this._updateAkeaBCRotationReset = obj["reset"] ? true : false;
                break;
            case "ScaleUser":
                this._updateScaleBCTime = parseInt(obj["time"]) || 30;
                this._AkeaEndScaleX = obj["scalex"] ? (parseFloat(obj["scalex"]) - this.mainSprite().scale.x) / this._updateScaleBCTime : 0;
                this._AkeaEndScaleY = obj["scaley"] ? (parseFloat(obj["scaley"]) - this.mainSprite().scale.y) / this._updateScaleBCTime : 0;
                this.mainSprite().anchor.y = parseFloat(obj["anchor"]) || 1;
                this._updateAkeaBCScaleReset = obj["reset"] ? true : false;
                break;
            case "OpacityUser":
                this._updateOpacityBCTime = parseInt(obj["time"]) || 30;
                this._AkeaEndOpacity = (parseInt(obj["opacity"]) - this.mainSprite().opacity) / this._updateOpacityBCTime;
                this._updateAkeaBCOpacityReset = obj["reset"] ? true : false;
                break;
            case "OpacityTarget":
                action.getTargets()[0]._akeaAnimatedBSActions.addCustomAddon(action.getId(), action.getTargets(), "OpacityUser", this, action.getAction(), action.getObject());
                break;
            case "RotateTarget":
                action.getTargets()[0]._akeaAnimatedBSActions.addCustomAddon(action.getId(), action.getTargets(), "RotateUser", this, action.getAction(), action.getObject());
                break;
            case "ScaleTarget":
                action.getTargets()[0]._akeaAnimatedBSActions.addCustomAddon(action.getId(), action.getTargets(), "ScaleUser", this, action.getAction(), action.getObject());
                break;
        }
    }
})();