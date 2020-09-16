//==========================================================================
// Ignis Main Menu Manager
//----------------------------------------------------------------------------
// 09/15/20 | Version: 1.0.0
// This software is released under the zlib License.
//============================================================================

/*:
 * @target MZ
 * @plugindesc Ignis Main Menu Manager version: 1.0.0
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * 
 * @help Ignis Main Menu Manager - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * For this plugin, you will only need to configure its parameters and what it is asking, 
 * for each item. Do remember to configure all of them!
 * 
 * @param menuOptions
 * @type struct<Menu>[]
 * @text New Menu Options
 * @desc Add new options to the menu here!
 * 
 */

/*~struct~Menu:
* @param name
* @type text
* @text Name in Menu
* @desc Name that will be shown on the menu
* @param switch
* @type number
* @text Switch
* @desc switch number that will activate this option, leave blank for the option to always be active
* @param scriptCall
* @type note
* @text Script Call
* @desc Script Call when this option is selectect, leave blank for no script call.
* @param commonEvent
* @type number
* @text Common Event
* @desc id of the common event that will be called, leave blank for no common event call.
* @param menuClose
* @type boolean
* @text Close Menu
* @desc Choose if the menu should be closed when the option is selected.

*/
// DON'T MODIFY THIS PART!!!
var Ignis = Ignis || {};
Ignis.MainMenuManager = Ignis.MainMenuManager || {};
Ignis.MainMenuManager.VERSION = [1, 0, 0];

//////////////////////////////////////////////////////////////////////////////////////////////////
//                      Ignis Main Menu Manager
//////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------------------------------------

(() => {
    const pluginName = "IgnisMainMenuManager";
    const parameters = PluginManager.parameters(pluginName);
    Ignis.MainMenuManager.jsonOpt = JSON.parse(parameters.menuOptions);
    Ignis.MainMenuManager.menuOptions = [];
    for (const menuOption of Ignis.MainMenuManager.jsonOpt) {
        Ignis.MainMenuManager.menuOptions.push(JSON.parse(menuOption));
        let len = Ignis.MainMenuManager.menuOptions.length - 1;
        Ignis.MainMenuManager.menuOptions[len].switch = Ignis.MainMenuManager.menuOptions[len].switch == "" ? false : parseInt(Ignis.MainMenuManager.menuOptions[len].switch);
        Ignis.MainMenuManager.menuOptions[len].commonEvent = Ignis.MainMenuManager.menuOptions[len].commonEvent == "" ? false : parseInt(Ignis.MainMenuManager.menuOptions[len].commonEvent);
        Ignis.MainMenuManager.menuOptions[len].menuClose = Ignis.MainMenuManager.menuOptions[len].menuClose == "true" ? true : false;
    }
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this, ...arguments);
        for (const options of Ignis.MainMenuManager.menuOptions) {
            if (!options.switch || $gameSwitches.value(options.switch)) {
                this.addCommand(options.name, options.name, true);
            }
        };
    };
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this, ...arguments);
        for (const options of Ignis.MainMenuManager.menuOptions) {
            this._commandWindow.setHandler(options.name, this.commandIgnisMainMenu.bind(this, options));
        };
    };
    Scene_Menu.prototype.commandIgnisMainMenu = function (options) {
        if (options.scriptCall){
            eval(JSON.parse(options.scriptCall))
        }  
        if (options.commonEvent)
            $gameMap._interpreter.setup($dataCommonEvents[options.commonEvent].list)
        if (options.menuClose)
            this.popScene();
    };
})();