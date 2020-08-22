/*:
 * @target MZ
 * @plugindesc Debug control for developing
 * @author Reisen (Mauricio Pastana)
 
 * @help Use F7 to fast boot, F6 to switch between active and inactive (only on test mode)
*/


//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Debug Control
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
        } else if (event.keyCode === 117) {
            this.ignisResumePlay = this.ignisResumePlay ? false : true
        }
    }
};

SceneManager.ignisRebootGame = function () {
    location.reload();
}
let _ignisEngine_SceneManager_isGameActive = SceneManager.isGameActive
SceneManager.isGameActive = function () {
    if ($gameTemp.isPlaytest()) { return !this.ignisResumePlay }
    _ignisEngine_SceneManager_isGameActive.call(this);
};
