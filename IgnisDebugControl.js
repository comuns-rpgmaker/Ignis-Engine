/*:
 * @target MZ
 * @plugindesc Debug control for developing
 * @author Reisen (Mauricio Pastana)
 
 * @help Use F7 to fast boot, F6 to switch between active and inactive (only on test mode)
 * @param DebugWindow
 * @type boolean
 * @desc If the chrome DevTools should automatically open with the test
 * @default false


 */


//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Debug Control
//////////////////////////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// SceneManager
//
// The scene class of the Manager.
//=============================================================================
// onKeyDown - alias function
//=============================================================================
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

//=============================================================================
// ignisRebootGame - new function
//=============================================================================
SceneManager.ignisRebootGame = function () {
    location.reload();
}
//=============================================================================
// isGameActive - alias function
//=============================================================================
let _ignisEngine_SceneManager_isGameActive = SceneManager.isGameActive
SceneManager.isGameActive = function () {
    if ($gameTemp.isPlaytest()) { return !this.ignisResumePlay }
    _ignisEngine_SceneManager_isGameActive.call(this);
};
//=============================================================================
// initialize - alias function
//=============================================================================
let _ignisEngine_Scene_Boot_initialize = Scene_Boot.prototype.initialize
Scene_Boot.prototype.initialize = function () {
    _ignisEngine_Scene_Boot_initialize.call(this);
    let ignisParameters = PluginManager.parameters('IgnisDebugControl');
    let windowDevToolsWindow = JSON.parse(ignisParameters['DebugWindow']);
    if (windowDevToolsWindow) { require('nw.gui').Window.get().showDevTools(); }
};
