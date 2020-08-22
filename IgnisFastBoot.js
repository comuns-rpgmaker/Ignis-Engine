/*:
 * @target MZ
 * @plugindesc Fast boot for development process
 * @author Reisen (Mauricio Pastana)
 
 * @help Use F7 to fast boot , just insert the plugin on the plugin manager
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
