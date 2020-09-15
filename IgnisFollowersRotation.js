//==========================================================================
// Ignis - Followers Rotation
//----------------------------------------------------------------------------
// 02/08/20 | Version: 1.0.0
// This software is released under the zlib License.
//============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a camera to battle and allows to control it.
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * @orderAfter GabeMZ_SmartFollowers
 * @help Ignis - Followers Rotation - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * 
 * This plugin is almost plug n' play, just activate it , 
 * configure the buttons and you should be ready!
 * Choose in the parameters the buttons you want to set the rotations, you can follow
 * This table below for help on what buttons are mapped:
 * 
 *  0: "ok", // A
*  1: "cancel", // B
*   2: "shift", // X
*   3: "menu", // Y
*   4: "pageup", // LB
*   5: "pagedown", // RB
*   12: "up", // D-pad up
*   13: "down", // D-pad down
*   14: "left", // D-pad left
*   15: "right" // D-pad right
 * 
 * I do recommend both pageup and down, they are buttons Q and W from the keyboard, 
 * and they are also mapped on the gamepad.
 * 
 * To create conditions to check which member is upfront, you can just put in the conditions
 * the following script:
 * frontMember(actorId)
 * It will return true if the frontMember has the same id as its actor id (the one on the 
 * database)
 * 
 * @param rotateUp
 * @type text
 * @default pageup
 * @text Rotate Party Up
 * @desc Configure the button to rotate up
 * 
 * @param rotateDown
 * @type text
 * @default pagedown
 * @text Rotate Party Down
 * @desc Configure the button to rotate down
*/


// DON'T MODIFY THIS PART!!!
var Ignis = Ignis || {};
Ignis.IgnisFollowersRotation = Ignis.IgnisFollowersRotation || {};
Ignis.IgnisFollowersRotation.VERSION = [1, 0, 0];

function frontMember(id) {
    return $gameParty.members()[0] == $gameActors.actor(id);
};
(() => {

    const pluginName = "IgnisFollowerRotation";
    const parameters = PluginManager.parameters(pluginName);
    Ignis.IgnisFollowersRotation.ButtonUp = parameters.rotateUp;
    Ignis.IgnisFollowersRotation.ButtonDown = parameters.rotateDown;


    const _Game_Followers_update = Game_Followers.prototype.update;
    Game_Followers.prototype.update = function () {
        _Game_Followers_update.call(this, ...arguments);
        if (this._isRotating) {
            if ($gamePlayer.isMoving() || this.visibleFollowers().some(follower => follower.isMoving()))
                return;
            $gamePlayer.moveAllPartyRotation();
            if ($gamePlayer.allPositionsRotationOk()) {
                $gamePlayer.setRotation(false);
                this._isRotating = false;
                $gameParty.rotateParty();
                $gamePlayer.setAllPartyRotationPlaces();
            }
            return;
        }
        if (Input.isTriggered(Ignis.IgnisFollowersRotation.ButtonUp)) {
            this.rotatePartyUp();
        }
        if (Input.isTriggered(Ignis.IgnisFollowersRotation.ButtonDown)) {
            this.rotatePartyDown();
        }
    }
    Game_Followers.prototype.rotatePartyUp = function () {
        $gamePlayer._numMoves = 0;
        this._isRotating = true;
        $gamePlayer.rotatePartyUp();
        $gamePlayer.saveOldPositions();
        $gamePlayer.setRotation(true);
    };
    Game_Followers.prototype.rotatePartyDown = function () {
        $gamePlayer._numMoves = this.visibleFollowers().length - 1;
        this._isRotating = true;
        $gamePlayer.rotatePartyDown();
        $gamePlayer.saveOldPositions();
        $gamePlayer.setRotation(true);
    };
    Game_Player.prototype.rotatePartyUp = function () {
        this._directionRotation = 1;
    };
    Game_Player.prototype.rotatePartyDown = function () {
        this._directionRotation = -1;
    };
    Game_Player.prototype.getRotationDirection = function () {
        return this._directionRotation;
    };
    const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function () {
        if (this.isRotating()) { return };
        _Game_Player_updateScroll.call(this, ...arguments);
    };
    const _Game_Followers_updateMove = Game_Followers.prototype.updateMove
    Game_Followers.prototype.updateMove = function () {
        if (!this._isRotating)
            _Game_Followers_updateMove.call(this, ...arguments);
    };
    Game_CharacterBase.prototype.chaseSpecificPoint = function (x, y) {
        const sx = this.deltaXFrom(x);
        const sy = this.deltaYFrom(y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed(4);
    };
    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function () {
        _Game_Player_initialize.call(this, ...arguments);
        this._isRotating = false;
        this._savedOldPositions = [];
    };
    Game_Player.prototype.setAllPartyRotationPlaces = function () {
        const followers = this._followers.visibleFollowers();
        for (let n = 1; n < this._savedOldPositions.length; n++) {
            followers[n - 1].setPosition(this._savedOldPositions[n][0], this._savedOldPositions[n][1]);
            followers[n - 1].setDirection(this._savedOldPositions[n][2]);
        }
        this.setPosition(this._savedOldPositions[0][0], this._savedOldPositions[0][1]);
        this.setDirection(this._savedOldPositions[0][2]);
        this.refresh();
    };
    Game_Player.prototype.moveAllPartyRotation = function () {
        const followers = this._followers.visibleFollowers();
        if (this._directionRotation == 1) {
            for (let n = 0; n < this._savedOldPositions.length - 1; n++) {
                followers[n].chaseSpecificPoint(this._savedOldPositions[n][0], this._savedOldPositions[n][1]);
            }
            if (this._savedOldPositions[this._numMoves + 1]) {
                this.chaseSpecificPoint(this._savedOldPositions[this._numMoves + 1][0], this._savedOldPositions[this._numMoves + 1][1]);
            }
            this._numMoves++;
        } else {
            for (let n = 0; n < followers.length - 1; n++) {
                followers[n].chaseSpecificPoint(this._savedOldPositions[n + 2][0], this._savedOldPositions[n + 2][1]);
            }
            if (this._numMoves >= 0) {
                followers[followers.length - 1].chaseSpecificPoint(this._savedOldPositions[this._numMoves][0], this._savedOldPositions[this._numMoves][1]);
            }
            this.chaseSpecificPoint(this._savedOldPositions[1][0], this._savedOldPositions[1][1]);
            this._numMoves--;
        }

    };
    Game_Player.prototype.isRotating = function () {
        return this._isRotating;
    };

    Game_Player.prototype.setRotation = function (rotate) {
        this._isRotating = rotate;
    };
    Game_Player.prototype.allPositionsRotationOk = function () {
        let allPosOk = true;
        if (this._directionRotation == 1) {
            allPosOk = allPosOk && this._savedOldPositions[this._savedOldPositions.length - 1][0] == this._realX && this._savedOldPositions[this._savedOldPositions.length - 1][1] == this._realY;
            const followers = this._followers.visibleFollowers();
            for (let n = 0; n < this._savedOldPositions.length - 1; n++) {
                allPosOk = allPosOk && this._savedOldPositions[n][0] == followers[n]._realX && this._savedOldPositions[n][1] == followers[n]._realY;
            }
        } else {
            allPosOk = allPosOk && this._savedOldPositions[1][0] == this._realX && this._savedOldPositions[1][1] == this._realY;
            const followers = this._followers.visibleFollowers();
            for (let n = 0; n < this._savedOldPositions.length - 2; n++) {
                allPosOk = allPosOk && this._savedOldPositions[n + 2][0] == followers[n]._realX && this._savedOldPositions[n + 2][1] == followers[n]._realY;
            }
            allPosOk = allPosOk && this._savedOldPositions[0][0] == followers[followers.length - 1]._realX && this._savedOldPositions[0][1] == followers[followers.length - 1]._realY;

        }
        return allPosOk;
    };
    Game_Player.prototype.saveOldPositions = function () {
        const followers = this._followers.visibleFollowers();
        this._savedOldPositions[0] = [];
        this._savedOldPositions[0][0] = parseInt(this.x);
        this._savedOldPositions[0][1] = parseInt(this.y);
        this._savedOldPositions[0][2] = this._direction;
        for (let n = 1; n <= followers.length; n++) {
            this._savedOldPositions[n] = [];
            this._savedOldPositions[n][0] = followers[n - 1].x;
            this._savedOldPositions[n][1] = followers[n - 1].y;
            this._savedOldPositions[n][2] = followers[n - 1].direction();
        }
    };

    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if (this.isRotating())
            return false;
        return _Game_Player_canMove.call(this, ...arguments);
    };
    Game_Party.prototype.rotateParty = function () {
        let savedPositions = [];
        for (let n = 0; n < this._actors.length; n++) {
            savedPositions[n] = [];
            savedPositions[n][0] = this.allMembers()[n]._realX;
            savedPositions[n][1] = this.allMembers()[n]._realY;
        }
        const rotatedActors = this._actors.rotate($gamePlayer.getRotationDirection());
        for (let n = 0; n < this._actors.length; n++) {
            this._actors[n]._realX = savedPositions[n][0];
            this._actors[n]._realY = savedPositions[n][1];
        }
        return rotatedActors;
    };
    Array.prototype.rotate = (function () {
        var push = Array.prototype.push,
            splice = Array.prototype.splice;
        return function (count) {
            var len = this.length >>> 0,
                count = count >> 0;
            count = ((count % len) + len) % len;
            push.apply(this, splice.call(this, 0, count));
            return this;
        };
    })();
})();