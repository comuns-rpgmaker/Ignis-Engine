/*:
 * @target MZ
 * @plugindesc Fast boot for development process
 * @author Reisen (Mauricio Pastana)
 
 * @help Use F7 to fast boot , this plugin also enables the game to run even when it is not active, only on test mode.
*/


//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Fast Boot
//////////////////////////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// SceneManager
//
// The scene class of the Manager.

let _ignisEngine_SceneManager_OnKeyDown = SceneManager.onKeyDown
SceneManager.onKeyDown = function (event) {
    _ignisEngine_SceneManager_OnKeyDown.call(this, event);
    if (!event.ctrlKey && !event.altKey) {
        if (event.keyCode === 118) {
            this.ignisRebootGame();
        }
    }
};

SceneManager.ignisRebootGame = function () {
    location.reload();
}
let _ignisEngine_SceneManager_isGameActive = SceneManager.isGameActive
SceneManager.isGameActive = function () {
    if ($gameTemp.isPlaytest()) { return true }
    _ignisEngine_SceneManager_isGameActive.call(this);
};
