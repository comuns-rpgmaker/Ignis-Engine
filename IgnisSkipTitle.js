/*:
 * @target MZ
 * @plugindesc Jumps the Title Screen, this enables the maker to create title screen with events.
 * @help You can call the old Title with SceneManager.push(Ignis_Scene_Title)
 * @author Reisen (Mauricio Pastana
 
 * @help IgnisSkipTitle.js
*/


//////////////////////////////////////////////////////////////////////////////////////////////////
//                      SKIP TITLE
//////////////////////////////////////////////////////////////////////////////////////////////////

let reisenEngine_Scene_Title_create = Scene_Title.prototype.create
let reisenEngine_Scene_Title_terminate = Scene_Title.prototype.terminate
let reisenEngine_Scene_Title_isBusy = Scene_Title.prototype.isBusy
let reisenEngine_Scene_Title_start = Scene_Title.prototype.start

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

function Ignis_Scene_Title() {
    this.initialize.apply(this, arguments);
}

Ignis_Scene_Title.prototype = Object.create(Scene_Title.prototype);
Ignis_Scene_Title.prototype.constructor = Ignis_Scene_Title;

Scene_Title.prototype.create = function () {
    if (this instanceof Ignis_Scene_Title){
		reisenEngine_Scene_Title_create.call(this)
        
	}
    else {
        Scene_Base.prototype.create.call(this)
    }
}
Scene_Title.prototype.terminate = function () {
    if (this instanceof Ignis_Scene_Title)
        reisenEngine_Scene_Title_terminate.call(this)
    else {
		Scene_Base.prototype.terminate.call(this);
        
    }
}
Scene_Title.prototype.isBusy = function () {
    if (this instanceof Ignis_Scene_Title)
        return reisenEngine_Scene_Title_isBusy.call(this)
    else {
        return false
    }
};
Scene_Title.prototype.start = function () {
    if (this instanceof Ignis_Scene_Title) {
		reisenEngine_Scene_Title_start.call(this)
    }
    else {
		Scene_Base.prototype.start.call(this)
        SceneManager.clearStack()
        DataManager.setupNewGame()
        SceneManager.goto(Scene_Map)
        
    }
}
