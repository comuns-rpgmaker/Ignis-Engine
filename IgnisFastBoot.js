/*:
 * @target MZ
 * @plugindesc Fast boot for plugin  developers
 * @help Use F7 to fast boot
 * @author Reisen (Mauricio Pastana)
 
 * @help IgnisSkipTitle.js
*/


//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Fast Boot
//////////////////////////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

let _ignisEngine_SceneManager_OnKeyDown = SceneManager.onKeyDown
SceneManager.onKeyDown = function (event) {
    console.log(event)
    _ignisEngine_SceneManager_OnKeyDown.call(this, event);
    if (!event.ctrlKey && !event.altKey) {
        console.log(event.keyCode)
        if (event.keyCode === 118) {
            this.ignisRebootGame();
        }
    }
};

SceneManager.ignisRebootGame = function () {
    SceneManager.goto(Scene_Boot);
}
