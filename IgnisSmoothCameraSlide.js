//=============================================================================
// RPG Maker MZ Ignis Smooth Camera Slide.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a smooth camera sliding when moving
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * 
 * @help Akea - Battle Shockwave Effect - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * @help You only need to configure the parameters, and you are ready to go!
 *
 * 
 * @param Switch
 * @type number
 * @desc The switch when on, turns off the smooth camera.
 * @default 1
 * 
 * @param Scroll X
 * @desc The speed in which the camera will move in the X axis (Higher = slower)
 * @default 20
  * @param Scroll Y
 * @desc The speed in which the camera will move in the Y axis (Higher = slower)
 * @default 20
 */



(() => {
    let ignisParameters = PluginManager.parameters('IgnisSmoothCameraSlide');
    let ignisScrollX = parseInt(ignisParameters['Scroll X'] || 20);
    let ignisScrollY = parseInt(ignisParameters['Scroll Y'] || 20);
    const ignisSwitch = parseInt(ignisParameters['Switch']);
    const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
        
        if ($gameSwitches.value(ignisSwitch)) {
            _Game_Player_updateScroll.call(this, ...arguments);
            return;
        }
        let x2 = this.scrolledX();
        let y2 = this.scrolledY();
        if (y2 > this.centerY()) {
            $gameMap.scrollDown((y2 - this.centerY()) / ignisScrollY);
        }
        if (x2 < this.centerX()) {
            $gameMap.scrollLeft((this.centerX() - x2) / ignisScrollX);
        }
        if (x2 > this.centerX()) {
            $gameMap.scrollRight((x2 - this.centerX()) / ignisScrollX);
        }
        if (y2 < this.centerY()) {
            $gameMap.scrollUp((this.centerY() - y2) / ignisScrollY);
        }
    };
}


)();
