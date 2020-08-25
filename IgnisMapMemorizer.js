//=============================================================================
// RPG Maker MZ - Ignis Map Memorizer
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Map Memorizer for MZ.
 * @author Reisen (Mauricio Pastana)
 *
 * @help Ignis Map Memorizer - 
 * For support and new plugins join our discord server! https://discord.gg/wsPeqeA
 * Want to support new creations? be a patreon! https://www.patreon.com/raizen884?fan_landing=true
 *
 * This plugin allows events to be saved and when the player comes back to the same map
 * That event will stay there
 * This plugin is configured via Plugin Commands
 *
 * @command memorize Event
 * @text 
 * @desc Memorize or Forget Event Position
 * 
 * @arg memorizeEvent
 * @type boolean
 * @on Memorize
 * @off Don't Memorize

 * @arg eventId
 * @type number
 *

 */

(() => {

    const pluginName = "IgnisMapMemorizer";

    PluginManager.registerCommand(pluginName, "memorize Event", args => {
        if (args.memorizeEvent == "true") {
            $gameMap.memorizeEventId(parseInt(args.eventId));
        } else {
            $gameMap.clearEventPosition(parseInt(args.eventId));
        }
    });
    //=============================================================================
    // * Game_Map
    //=============================================================================
    //=============================================================================
    // initialize - alias function
    //=============================================================================
    let _ignisEngine_MapMemorizer_Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function () {
        _ignisEngine_MapMemorizer_Game_Map_initialize.call(this, ...arguments);
        this._ignisMemorizedEvents = new Array();
        this._ignisNeedMemorization = new Array();
    };
    //=============================================================================
    // setup - alias function
    //=============================================================================
    let _ignisEngine_MapMemorizer_Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        if (!this._ignisMemorizedEvents[mapId]) { this._ignisMemorizedEvents[mapId] = [] }
        if (!this._ignisNeedMemorization[mapId]) { this._ignisNeedMemorization[mapId] = [] }
        _ignisEngine_MapMemorizer_Game_Map_setup.call(this, ...arguments);

    }
    //=============================================================================
    // saveEventPosition - new function
    //=============================================================================
    Game_Map.prototype.saveEventPosition = function (eventId) {
        let event = this.events().filter(event => event.eventId() == eventId)[0]
        this._ignisMemorizedEvents[this._mapId][eventId] = [event.x, event.y, event._direction];
    };
    //=============================================================================
    // memorizeEventId - new function
    //=============================================================================
    Game_Map.prototype.memorizeEventId = function (eventId) {
        this._ignisNeedMemorization[this._mapId][eventId] = true;
    };
    //=============================================================================
    // clearEventPosition - new function
    //=============================================================================
    Game_Map.prototype.clearEventPosition = function (eventId) {
        this._ignisNeedMemorization[this._mapId][eventId] = false;
        this._ignisMemorizedEvents[this._mapId][eventId] = false;
    };
    //=============================================================================
    // setupEvents - alias function
    //=============================================================================
    let _ignisEngine_MapMemorizer_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _ignisEngine_MapMemorizer_Game_Map_setupEvents.call(this, ...arguments);
        for (const event of this.events().filter(event => !!event)) {
            let ev = this._ignisMemorizedEvents[this._mapId][event.eventId()];
            if (ev) {
                event.locate(ev[0], ev[1]);
                event.setDirection(ev[2]);
            }
        }
    };
    //=============================================================================
    // reserveTransfer - alias function
    //=============================================================================
    let _ignisEngine_MapMemorizer_Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
        _ignisEngine_MapMemorizer_Game_Player_reserveTransfer.call(this, ...arguments);
        if ($gameMap._ignisNeedMemorization[$gameMap.mapId()] != null)
            for (var n = 0; n < $gameMap._ignisNeedMemorization[$gameMap.mapId()].length; n++) {
                if ($gameMap._ignisNeedMemorization[$gameMap.mapId()][n]) { $gameMap.saveEventPosition(n); }
            }
    };
})();
