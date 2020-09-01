
//=============================================================================
// RPG Maker MZ AkeaAnimatedBattleSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Akea Animated Battle System 2
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884
 * @help If you want to support me further more, become a patreon!
 * You can chat, get support, report bugs on our discord Server: https://discord.gg/wsPeqeA
 * You can get some beautiful battler with Vibrato! http://p3x774.web.fc2.com/
 * This plugin is under zlib license.
 * 
 * 
 * Welcome to the ultimate action battle system experience!
 * For battle add-on developers head to NOTES FOR ADD-ON DEVS, in this code to
 * know how to optimize your add for this system!
 * 
 * You have in hands a very powerful battle system, to get a look at how the battle is
 * configured, I would grab a demo first:
 * 
 * With the demo there are some big configurations to do if you want to customize,
 * you can also keep it simple if you wish to use more default-ish sv battlers.
 * 
 * Each parameter has a text to help you now what it is configuring, but the main core of
 * this battle system are the:
 * Poses - Poses are the stance the battlers take when they meet certain conditions,
 * poses can be an battler attacking, dodging, jumping, and anything else you
 * think of. 
 * MZ has 18 default poses, which are:
 * walk: 
 * wait: 
 * chant: 
 * guard: 
 * damage: 
 * evade: 
 * thrust: 
 * swing: 
 * missile:
 * skill: 
 * spell: 
 * item: 
 * escape: 
 * victory:
 * dying: 
 * abnormal
 * sleep: 
 * dead: 
 * All those are already configured in this battle system by default, if you create a new
 * pose that has the same name of this one it will be overwritten ONLY for the characters
 * you choose the pose. Ah do remember, each battler(Actors or Enemies), after you configure the
 * pose, you need to append them to that battler, that gives TOTAL freedom to have multiple
 * poses for different battlers.
 * 
 * The second part of this System is the actions, Actions are the movement the battler takes,
 * Actions can be any movement like going toward character, jumping high, running, walking forward.
 * Anything you want. Combine them with poses and you have a lot of freedom to create your
 * dream battle for your game!
 * You can add the following tags to your notes on skills or items of the database:
 * 
 * <akeaActions number> : Number of the action, Ex: <akeaAction 2> to get the second
 * action on the parameters
 * 
 * <akeaActionEnemy number> : exactly the same as above, but the action will be dealt
 * to the target and not the user.
 * 
 * <akeaAniTarget number> : Play a, database animation on the target Ex:
 * <akeaAniTarget 55> : Plays animation id 55 on the Target
 * 
 * <akeaAniSelf number> : Same as above, but on the user Ex:
 * <akeaAniSelf 55> : Plays animation id 55 on the User
 * 
 * <akeaScript number> : Calls the expression configured on the Script Call parameters:
 * <akeaScript 33> : Calls the expression 33 on the parameters
 * 
 * <akeaSkill number> : Appends skill to the current skill, just be careful to not make loops:
 * <akeaSkill 27> : Calls the skill 27, all animations will be added to the current one
 * 
 * <akeaHit damage> : Calls a damage to the target, this damage is in percent according 
 * to the same formula in that skill on the database
 * <akeaHit 50> : Calls a hit for aproximately 50% damage of the skill formula
 * 
 * <akeaHitAll damage> : Same as above, but with all targets
 * <akeaHitAll 50> : Calls a hit for aproximately 50% damage of the skill formula
 * 
 * <akeaWait time> : Waits a certain time before the next action, in frames, usually 60 = 1 second
 * <akeaHitAll 60> : Waits 60 frames (1 second)
 * 
 * <akeaRandomize 1> : Randomizes the target, choose random target on the skill and this
 * will change targets in the middle of the Action!
 * 
 * 
 * 
 * That is the basics, if you have any more question, head toward our discord server for
 * further support.
 * Do remeber this system was made optimized to accept most add-ons, so do not hesitate to
 * try an add-on with it!
 * 

 * @param Frame Configuration
 * @type struct<PosesFrames>[]
 * @text Spritesheet Configuration
 * @desc Configure Poses Spritesheet here if want to add different type of spritesheets.
 * 
 * @param Actor Configuration
 * @type struct<ActorPoses>[]
 * @text Actor Spritesheet Configuration
 * @desc Configure Actor Spritesheet here, if an actor is not configured here, default spritesheet will be used.
 * @param Actor Poses
 * @type struct<EmbedPose>[]
 * @text Actor Poses Configuration
 * @desc You can add any number of poses to an actor ID
 * @param Enemy Configuration
 * @type struct<EnemyPoses>[]
 * @text Enemy Spritesheet Configuration
 * @desc Configure Enemy Spritesheet here, if an enemy is not configured here, he will not use spritesheets.
 * @param Enemy Poses
 * @type struct<EmbedPose>[]
 * @text Enemy Poses Configuration
 * @desc You can add any number of poses to an enemy ID
 * @param Poses
 * @type struct<Poses>[]
 * @text All poses configuration
 * @desc Configure any extra pose here, if you use the same name as an existing pose, it will use this one instead
 * @param Actions
 * @type struct<Actions>[]
 * @text All action configuration
 * @desc Configure all actions here, actions are the movement from the battlers
 * @param Script
 * @type struct<Script>[]
 * @text Script Calls
 * @desc Configure if any script call to be used during actions
 * @param entryActors
 * @type struct<EntryPose>
 * @text Entry Actors
 * @desc Action of actors entering the battle
 * @param entryEnemies
 * @type struct<EntryPose>
 * @text Entry Enemies
 * @desc Action id of enemies entering the battle
 * @param returnAction
 * @type number
 * @text Step Back Action
 * @desc Action number to return battlers
 * @param stepForward
 * @type number
 * @text Step Forward Action
 * @desc Action number to make battlers step forward
 * @param retreat
 * @type number
 * @text Retreat Action
 * @desc Action number to make battlers retreat
 * @param damage
 * @type number
 * @text Damage Action
 * @desc Action number to make battlers take damage
 * @param evade
 * @type number
 * @text Evade Action
 * @desc Action number to make battlers evade hits
 */
/*~struct~EntryPose:
 * @param action
 * @type number
 * @default 1
 * @desc Id of the action to be used for entering the battlefield
 * @param offsetX
 * @type number
 * @default 400
 * @min -10000
 * @desc Offset in X from the starting point
 * @param offsetY
 * @type number
 * @default -50
 * @min -10000
 * @desc Offset in Y from the starting point
 * @param homeX
 * @type text
 * @default 600 + index * 32
 * @desc formula of the battlers X final spot when on the battle (only actors)
 * @param homeY
 * @type text
 * @default 280 + index * 48
 * @desc formula of the battlers Y final spot when on the battle (only actors)
 
*/
/*~struct~EmbedPose:
 * @param id
 * @type number
 * @default 1
 * @desc Id of the Actor/Enemy to add the poses
 * @param poses
 * @type number[]
 * @desc Poses that will be loaded for this character, they are configures on "Poses"
*/

/*~struct~Poses:
 * @param info
 * @type string
 * @default info
 * @desc This area is free to use to help organization
 * @param name
 * @type string
 * @default stand
 * @desc Name of the Pose, you can duplicate name poses for different indexes
 * @param InOut
 * @type boolean
 * @default false
 * @desc If false, frames will rotate like usual 1-2-3-1-2, if true 1-2-3-4-3-2-1-2
 * @param loop
 * @type boolean
 * @default true
 * @desc If true, animation will loop
 * @param frequency
 * @type number
 * @default 12
 * @desc the frequency the frame animates, 12 is default, the lower the faster.
 * @param poseIndex
 * @type number
 * @default 1
 * @desc index of the pose in the spritesheet
 */


/*~struct~ActorPoses:
 * @param id
 * @type number
 * @default 1
 * @desc Id of actor or enemy on the database
 * @param baseSpritesheet
 * @type number
 * @default 1
 * @desc Spritesheet to be used, configure the spritesheets on Frame Configuration, 0 for default spritesheet poses.
 */
/*~struct~EnemyPoses:
 * @param id
 * @type number
 * @default 1
 * @desc Id of actor or enemy on the database
 * @param baseSpritesheet
 * @type number
 * @default 1
 * @desc Spritesheet to be used, configure the spritesheets on Frame Configuration, 0 for default spritesheet poses.
 * @param svBattler
 * @type file
 * @dir img/sv_enemies/
 * @desc Image of the enemy SV Battler
 */
/*~struct~PosesFrames:
 * @param FrameNum
 * @type number
 * @default 4
 * @desc Numbers of maximum frames, you can configure the frames individually also
 * @param SpritesheetHeight
 * @type number
 * @default 6
 * @desc Spritesheet height, the number of poses from up to down (default has 6)
 * @param SpritesheetWidth
 * @type number
 * @default 9
 * @desc Spritesheet width, the number of poses from left to right (default has 9)
 */

/*~struct~Actions:
 * @param info
 * @type string
 * @default info
 * @desc This area is free to use to help organization
* @param pose
* @type text
* @default waiting
* @desc Name of the pose you want this action to make, look at help for default poses
* @param time
* @type number
* @default 10
* @desc Time in frames to execute this action
* @param movementType
* @type select
* @option absolute
* @option fromHome
* @option target
* @option noMove
* @desc The type of movement, absolute considers where the character is, fromHome where is his "base", target goes to target.
* @param offsetX
* @type number
* @default 10
* @max 10000
* @min -10000
* @desc how much in X character will move, depends on the movement Type selected
* @param offsetY
* @type number
* @default 10
* @max 10000
* @min -10000
* @desc how much in Y character will move, depends on the movement Type selected
* @param jumpHeight
* @type number
* @default 0
* @desc Height of the jump, 0 for no jump.
* @param levitate
* @type boolean
* @default false
* @desc If true, shadow will stay in its place.
 * @param mirror
 * @type boolean
 * @default false
 * @desc mirror action?
*/

/*~struct~Script:
* @param scriptCall
* @type note
* @default alert("This is a Script Call")
* @desc Put the script call here.
*/
/*
||       NOTES FOR ADD-ON DEVS!!!!
||
||   Most add-ons should work fine for this system, but if you do wish to 
|| further improve your add-on experience with the plugin, you will do as it follows.
\\
\\ callAkeaActions : translates the commands in the notes from the skill/item through a regex
\\ <akeaNameAction yourparameters>
\\ or for Regular expressions Group  1 <akeaNameAction yourparameters>
\\ Group  2 NameAction  Group  3 yourparameters
\\ pretty simple right? RegExp.$3 will hold your parameters and RegExp.$2 your action name.
\\ Below is after the action has been translated, when it will occur on the action.
\\ It is a FIFO, so you can know the order of the actions here.
\\ The Game_Akea_Actions and Game_Akea_Action hold the actions that will be passed to the
\\ Sprite, you can if you wish to add new functions to better improve compatibility.

\\ When creating your add-on, correctly alias callAkeaActions and manageAkeaActions
\\ Example Below of a picture add-on.

let _specificName_Game_Battler_callAkeaActions = Game_Battler.prototype.callAkeaActions
Game_Battler.prototype.callAkeaActions = function (action, targets) {
    _specificName_Game_Battler_callAkeaActions.call(this, ...arguments);
    if (RegExp.$2 == "Picture") { //Which would be called <akeaPicture id>
        this._akeaAnimatedBSActions.addAkeaHit(RegExp.$3, targets, RegExp.$2, this, action);
            OR A new one
        this._akeaAnimatedBSActions.addPicture(RegExp.$3, targets, RegExp.$2, this, action);
    }
}
let _specificName_Sprite_Battler_callAkeaActions = Sprite_Battler.prototype.callAkeaActions
Sprite_Battler.prototype.manageAkeaActions = function (action) {
    _specificName_Sprite_Battler_callAkeaActions.call(this, ...arguments);
    if (action.getActionType() == "Picture") { //Which would be called <akeaPicture id>
        this.callMyFunction(action.getId());    
    }
}

Pretty simple right? Any questions, you know where to find me :)


*/

// NÃO MEXE AQUI POR FAVOR :(!
// No touching this part!
var Akea = Akea || {};
Akea.BattleSystem = Akea.BattleSystem || {};
Akea.BattleSystem.VERSION = [1, 0, 1];


Game_Battler.prototype.callAkeaActions = function (action, targets) {
    switch (RegExp.$2) {
        case "Randomize":
            this._akeaAnimatedBSActions.addAkeaHit(RegExp.$3, targets, RegExp.$2, this, action);
            break;
        case "Actions":
            this._akeaAnimatedBSActions.addAkeaSkillActions(RegExp.$3, targets, RegExp.$2, action);
            break;
        case "ActionEnemy":
            this._akeaAnimatedBSActions.addAkeaSkillActionsEnemy(RegExp.$3, targets, RegExp.$2, this, action);
            break;
        case "AniTarget":
            this._akeaAnimatedBSActions.addAkeaAnimation(RegExp.$3, targets, RegExp.$2, action);
            break;
        case "AniSelf":
            this._akeaAnimatedBSActions.addAkeaAnimation(RegExp.$3, [this], RegExp.$2, action);
            break;
        case "Script":
            this._akeaAnimatedBSActions.addAkeaScript(RegExp.$3, targets, RegExp.$2, this, action);
            break;
        case "Skill":
            this.translateSkillActions(action, targets, $dataSkills[RegExp.$3], action);
            break;
        case "Hit":
            this._akeaAnimatedBSActions.addAkeaHit(RegExp.$3, targets, RegExp.$2, this, action);
            break;
        case "HitAll":
            this._akeaAnimatedBSActions.addAkeaHit(RegExp.$3, targets, RegExp.$2, this, action);
            break;
        case "Wait":
            this._akeaAnimatedBSActions.addAkeaHit(RegExp.$3, targets, RegExp.$2, this, action);
            break;
    }
};

Sprite_Battler.prototype.manageAkeaActions = function (action) {
    this._movementDuration = 3;
    let subject;
    let moveAction;
    let targets;
    let scriptCall;
    let originalLength;
    if (action.getTargets() && (!action.getTargets()[0] || action.getTargets()[0].hp == 0)) {
        if (action.getTargets()[0])
            action.getTargets()[0].clearAkeaAnimatedBSActions();
        this._battler.getAkeaAnimatedBSActions().newTarget();
        BattleManager.akeaEmptyWindow();
    }
    if (action.getTargets().length == 0) {
        targets = action.getTargets();
        this._battler.clearAkeaAnimatedBSActions();
        return;
    }
    switch (action.getActionType()) {
        case "Randomize":
            this._battler.getAkeaAnimatedBSActions().isSingleTarget = true;
            this._battler.getAkeaAnimatedBSActions().newTarget();
            break;
        case "Actions":
            this.akeaActionTranslate(action);
            break;
        case "ActionEnemy":
            moveAction = action.getAction();
            action.getTargets()[0]._akeaAnimatedBSActions.addAkeaSkillActions(action.getId(), action.getEnemy(), "Actions", moveAction);
            break;
        case "AniTarget":
            $gameTemp.requestAnimation(action.getTargets(), action.getId());
            break;
        case "AniSelf":
            $gameTemp.requestAnimation([this._battler], action.getId());
            break;
        case "Script":
            subject = action.getSubject();
            targets = action.getTargets();
            scriptCall = action.getScript();
            eval(scriptCall);
            break;
        case "Hit":
            this._movementDuration = 30;
            subject = action.getSubject();
            targets = action.getTargets();
            moveAction = action.getAction();
            moveAction.applyAkeaHit(targets[0], action.getId())
            originalLength = BattleManager.getWindowMethodsLength();
            BattleManager._logWindow.push("popupDamage", (targets[0]));
            BattleManager._logWindow.displayActionResults(subject, targets[0])
            BattleManager.startActionAkea(subject, moveAction, targets);
            BattleManager.akeaEmptyWindow(originalLength);
            BattleManager._logWindow.displayChangedStates(targets[0]);
            this._battler.getAkeaAnimatedBSActions().originalTarget(this._battler.initialTargets);
            break;
        case "HitAll":
            this._movementDuration = 30;
            subject = action.getSubject();
            targets = action.getTargets();
            moveAction = action.getAction();
            originalLength = BattleManager.getWindowMethodsLength();
            for (let t of targets) {
                moveAction.applyAkeaHit(t, action.getId())
                BattleManager._logWindow.push("popupDamage", (t));
                BattleManager._logWindow.displayActionResults(subject, t)
            }

            BattleManager.startActionAkea(subject, moveAction, targets);
            BattleManager.akeaEmptyWindow(originalLength);
            for (let t of targets) { BattleManager._logWindow.displayChangedStates(t) };
            this._battler.getAkeaAnimatedBSActions().originalTarget(this._battler.initialTargets);
            break;
        case "FinishAction":
            this._movementDuration = 60;
            subject = action.getSubject();
            targets = action.getTargets();
            moveAction = action.getAction();
            this._battler = subject;
            if (this._battler.getAkeaAnimatedBSActions().isSingleTarget) {
                BattleManager.startActionLast(subject, moveAction, [targets[0]]);
            }
            BattleManager.startActionLast(subject, moveAction, targets);
            break
        case "Wait":
            this._movementDuration = action.getId();
            break
    }
}

//-----------------------------------------------------------------------------
// Game_Akea_Actions
//
// This class manages Akea Battle Actions


function Game_Akea_Actions() {
    this.initialize(...arguments);
}

Game_Akea_Actions.prototype = Object.create(Object.prototype);
Game_Akea_Actions.prototype.constructor = Game_Akea_Actions;

Game_Akea_Actions.prototype.initialize = function () {
    this._actions = [];
    this.action = "";
    this.isSingleTarget = false;
    const paramActions = PluginManager.parameters('AkeaAnimatedBattleSystem');
    this._akeaSkillList = JSON.parse(paramActions['Actions']);
    this._akeaScriptList = JSON.parse(paramActions['Script']);
};

Game_Akea_Actions.prototype.newTarget = function () {
    let newtarget = this.action.makeTargets();
    for (const action of this._actions) { action.setTargets(newtarget) }
}
Game_Akea_Actions.prototype.originalTarget = function (targets) {
    for (const action of this._actions) { action.setTargets(targets) }
}
Game_Akea_Actions.prototype.idToAction = function (id, targets, moveAction) {
    let actionObj = JSON.parse(this._akeaSkillList[id - 1]);
    let action = new Game_Akea_Action();
    action.setMovementType(actionObj.movementType);
    action.setPose(actionObj.pose);
    action.setDuration(parseInt(actionObj.time));
    action.setOffsetX(parseInt(actionObj.offsetX));
    action.setOffsetY(parseInt(actionObj.offsetY));
    action.setJumpHeight(parseInt(actionObj.jumpHeight));
    action.setTargets(targets);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.addAkeaSkillActions = function (id, targets, type, moveAction) {
    let actionObj = JSON.parse(this._akeaSkillList[id - 1]);
    let action = new Game_Akea_Action();
    let mirror = actionObj.mirror == "true" ? true : false;
    action.setActionType(type);
    action.setMovementType(actionObj.movementType);
    action.setPose(actionObj.pose);
    action.setDuration(parseInt(actionObj.time));
    action.setOffsetX(parseInt(actionObj.offsetX));
    action.setOffsetY(parseInt(actionObj.offsetY));
    action.setJumpHeight(parseInt(actionObj.jumpHeight));
    action.setTargets(targets);
    action.setMirror(mirror);
    action.setAction(moveAction);
    action.setLevitation(actionObj.levitate == "true" ? true : false);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.addAkeaSkillActionsEnemy = function (id, targets, type, subject, moveAction) {
    let actionObj = JSON.parse(this._akeaSkillList[id - 1]);
    let action = new Game_Akea_Action();
    action.setId(id);
    action.setActionType(type);
    action.setMovementType(actionObj.movementType);
    action.setPose(actionObj.pose);
    action.setDuration(parseInt(actionObj.time));
    action.setOffsetX(parseInt(actionObj.offsetX));
    action.setOffsetY(parseInt(actionObj.offsetY));
    action.setJumpHeight(parseInt(actionObj.jumpHeight));
    action.setTargets(targets);
    action.setEnemy(subject);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}


Game_Akea_Actions.prototype.addAkeaHit = function (id, targets, type, subject, moveAction) {
    let action = new Game_Akea_Action();
    action.setActionType(type);
    action.setId(id);
    action.setTargets(targets);
    action.setSubject(subject);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.addAkeaAnimation = function (id, targets, type, moveAction) {
    let action = new Game_Akea_Action();
    action.setActionType(type);
    action.setId(id);
    action.setTargets(targets);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.addAkeaScript = function (id, targets, type, subject, moveAction) {
    let actionObj = JSON.parse(this._akeaScriptList[id - 1]);
    let action = new Game_Akea_Action();
    action.setActionType(type);
    action.setScript(actionObj.scriptCall);
    action.setTargets(targets);
    action.setSubject(subject);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.addAkeaNewSkill = function (id, targets, type, moveAction) {
    let actionObj = JSON.parse(this._akeaSkillList[id - 1]);
    let action = new Game_Akea_Action();
    action.setActionType(type);
    action.setScript(actionObj.scriptCall);
    action.setTargets(targets);
    action.setAction(moveAction);
    this.action = moveAction;
    this._actions.push(action);
}

Game_Akea_Actions.prototype.hasActions = function () {
    return this._actions.length > 0;
};
Game_Akea_Actions.prototype.canContinue = function () {
    return this._actions.length == 0;
};

Game_Akea_Actions.prototype.unloadAction = function () {
    return this._actions.shift();
};

//-----------------------------------------------------------------------------
// Game_Akea_Action
//
// This class manages Akea an individual Battle Action


function Game_Akea_Action() {
    this.initialize(...arguments);
}

Game_Akea_Action.prototype = Object.create(Object.prototype);
Game_Akea_Action.prototype.constructor = Game_Akea_Action;

Game_Akea_Action.prototype.initialize = function () {
    this._pose = "";
    this._movementType = "";
    this._actionType = "";
    this._offsetX = 0;
    this._offsetY = 0;
    this._jumpHeight = 0;
    this._actionId = 0;
    this._duration = 0;
    this._targets = false;
    this._enemy = "";
    this._id = 0;
    this._mirror = false;
};
Game_Akea_Action.prototype.setPose = function (pose) {
    this._pose = pose;
}
Game_Akea_Action.prototype.setMovementType = function (movementType) {
    this._movementType = movementType;
}
Game_Akea_Action.prototype.setActionType = function (actionType) {
    this._actionType = actionType;
}
Game_Akea_Action.prototype.setOffsetX = function (offsetX) {
    this._offsetX = offsetX;
}
Game_Akea_Action.prototype.setOffsetY = function (offsetY) {
    this._offsetY = offsetY;
}
Game_Akea_Action.prototype.setJumpHeight = function (jumpHeight) {
    this._jumpHeight = jumpHeight;
}
Game_Akea_Action.prototype.setActionId = function (actionId) {
    this._actionId = actionId;
}
Game_Akea_Action.prototype.setDuration = function (duration) {
    this._duration = duration;
}
Game_Akea_Action.prototype.setTargets = function (targets) {
    this._targets = targets;
}
Game_Akea_Action.prototype.setScript = function (text) {
    this._script = text;
}
Game_Akea_Action.prototype.setEnemy = function (enemy) {
    this._enemy = enemy;
}
Game_Akea_Action.prototype.setId = function (id) {
    this._id = id;
}
Game_Akea_Action.prototype.setSubject = function (subject) {
    this._subject = subject;
}
Game_Akea_Action.prototype.setAction = function (action) {
    this._action = action;
}
Game_Akea_Action.prototype.setMirror = function (mirror) {
    this._mirror = mirror;
}
Game_Akea_Action.prototype.setLevitation = function (levitate) {
    this._levitate = levitate;
}
Game_Akea_Action.prototype.getLevitation = function () {
    return this._levitate;
}
Game_Akea_Action.prototype.getMirror = function () {
    return this._mirror;
}
Game_Akea_Action.prototype.getAction = function () {
    return this._action;
}
Game_Akea_Action.prototype.getSubject = function () {
    return this._subject;
}
Game_Akea_Action.prototype.getId = function () {
    return this._id;
}
Game_Akea_Action.prototype.getEnemy = function () {
    return this._enemy;
}
Game_Akea_Action.prototype.getScript = function () {
    return this._script;
}
Game_Akea_Action.prototype.getTargets = function () {
    return this._targets;
}
Game_Akea_Action.prototype.getActionType = function () {
    return this._actionType;
}
Game_Akea_Action.prototype.getPose = function () {
    return this._pose;
}
Game_Akea_Action.prototype.getMovementType = function () {
    return this._movementType;
}
Game_Akea_Action.prototype.getOffsetX = function () {
    return this._offsetX;
}
Game_Akea_Action.prototype.getOffsetY = function () {
    return this._offsetY;
}
Game_Akea_Action.prototype.getJumpHeight = function () {
    return this._jumpHeight;
}
Game_Akea_Action.prototype.getActionId = function () {
    return this._actionId;
}
Game_Akea_Action.prototype.getDuration = function () {
    return this._duration;
}



Sprite_Battler.prototype.startMotion = function (motionType) {
    const newMotion = this.akeaMotions[motionType];
    if (!newMotion) {
        //alert(`${motionType} is not correctly configured!`);
        return;
    }
    if (this._motion !== newMotion) {
        this._akeaAnimatedBSFrameSpeed = newMotion.speed;
        this._akeaInOutFrame = newMotion.inOut;
        this._akeaPatternMotion = 1;
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
};

Sprite_Battler.prototype.refreshMotion = function () {
    if (this._battler.motionType() == "damage") {
        this.takeDamage();
        return;
    } else if (this._battler.motionType() == "evade") {
        this.evadeHit();
        return;
    }
    if (this._movementDuration > 0) {
        return
    }
    this.startMove(this._offsetX, this._offsetY, 0);
    const actor = this._battler.isEnemy() ? this._enemy : this._actor;
    if (actor) {
        const stateMotion = actor.stateMotionIndex();
        if (actor.isInputting() || actor.isActing()) {
            this.startMotion("walk");
        } else if (stateMotion === 3) {
            this.startMotion("dead");
        } else if (stateMotion === 2) {
            this.startMotion("sleep");
        } else if (actor.isChanting()) {
            this.startMotion("chant");
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            this.startMotion("guard");
        } else if (stateMotion === 1) {
            this.startMotion("abnormal");
        } else if (actor.isDying()) {
            this.startMotion("dying");
        } else if (actor.isUndecided()) {
            this.startMotion("walk");
        } else {
            this.startMotion("wait");
        }
    }
};

Sprite_Battler.prototype.updateMove = function () {
    if (this._movementDuration > 0) {
        this._currentJumpAcceleration = (this._movementDuration * 2 - this._akeaMaxDuration) * this._jumpHeight / 10;
        this._currentJumpHeight += Math.floor(this._currentJumpAcceleration);
        const d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
    }
    if (this._movementDuration === 0) {
        this._currentJumpHeight = 0;
    }
    if (this._movementDuration <= 0 && this._battler.getAkeaAnimatedBSActions().hasActions()) {
        this.unloadMovementAkea();
    } else if (this._battler.getAkeaAnimatedBSActions().canContinue()) {
        this.onMoveEnd();
        this._battler._akeaRetreating = false
    }

};


Sprite_Battler.prototype.createDamageSprite = function () {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x + 8;
        sprite.y = last.y - 16;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    sprite.setup(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
    sprite._zIndex = 10000;
};


Sprite_Battler.prototype.updateMotionCount = function () {
    if (this._motion && ++this._motionCount >= this.akeaMotionspeed()) {
        if (this._motion.loop) {
            this._pattern = this.updateAkeaPattern();
        } else if (this._pattern + 1 < this.akeaMaxFrame) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    };
};

Sprite_Battler.prototype.updateAkeaFrame = function () {
    const bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        const motionIndex = this._motion ? this._motion.index : 0;
        const pattern = this._pattern < this.akeaMaxFrame ? this._pattern : 1;
        const cw = bitmap.width / this.akeaAnimatedBSMaxWidth;
        const ch = bitmap.height / this.akeaAnimatedBSMaxHeight;
        const cx = Math.floor(motionIndex / this.akeaAnimatedBSMaxHeight) * 3 + pattern;
        const cy = motionIndex % this.akeaAnimatedBSMaxHeight;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        this.setFrame(0, 0, cw, ch);
        this.scale.x = this._akeaMirror ? -1 : 1;
        if (this._akeaMirroredMoves) { this.scale.x *= -1 };
    }
    return; // Below is old Frame
}

Sprite_Battler.prototype.getJumpHeight = function () {
    return this._currentJumpHeight;
}

Sprite_Battler.prototype.akeaActionTranslate = function (action) {
    this._battler.requestMotion(action.getPose());
    let offsetX = this._akeaMirroredMoves ? -action.getOffsetX() : action.getOffsetX();
    let offsetY = this._akeaMirroredMoves ? -action.getOffsetY() : action.getOffsetY();
    if (action.getMovementType() == "absolute") {
        this.startMove(this._offsetX + offsetX, this._offsetY + offsetY, action.getDuration(), action.getJumpHeight(), action.getLevitation());
        this._zIndex = this._offsetY + offsetY + this._homeY;
    } else if (action.getMovementType() == "target") {
        this.startMove(action.getTargets()[0].screenX() - this._homeX + offsetX, action.getTargets()[0].screenY() - this._homeY + offsetY, action.getDuration(), action.getJumpHeight(), action.getLevitation());
        this._zIndex = action.getTargets()[0].screenY() + offsetY;
    } else if (action.getMovementType() == "fromHome") {
        this.startMove(offsetX, offsetY, action.getDuration(), action.getJumpHeight(), action.getLevitation());
        this._zIndex = offsetY + this._homeY;
    } else if (action.getMovementType() == "noMove") {
        this.startMove(this._offsetX, this._offsetY, action.getDuration(), action.getJumpHeight(), action.getLevitation());
        this._zIndex = this._offsetY + this._homeY + 10;
    }
    this._akeaMirror = action.getMirror();
}


Sprite_Battler.prototype.unloadMovementAkea = function () {
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.manageAkeaActions(action);
}


Sprite_Battler.prototype.startMove = function (x, y, duration, jumpHeight = 0, levitation = false) {
    this._targetOffsetX = x;
    this._targetOffsetY = y;
    this._movementDuration = duration;
    this._akeaMaxDuration = duration;
    this._jumpHeight = jumpHeight;
    this._currentJumpHeight = 0;
    if (this._shadowSprite)
        this._shadowSprite.opacity = levitation ? 0 : 255;
    this._currentJumpAcceleration = 0;
    if (duration === 0) {
        this._offsetX = x;
        this._offsetY = y;
    }
};

Sprite_Battler.prototype.moveToStartPosition = function () {
    this.startMove(300, 0, 0);
};

Sprite_Battler.prototype.updatePosition = function () {
    this.x = parseInt(this._homeX + this._offsetX);
    this.y = parseInt(this._homeY + this._offsetY - this.getJumpHeight());
    if (this._shadowSprite)
        this._shadowSprite.y = parseInt(this.getJumpHeight() - 2);
    this._battler.updateScreenPosition(this.x, this.y);
};

Sprite_Battler.prototype.getAnyActions = function () {
    let hasActions = this._battler ? this._battler._akeaRetreating : false;
    return hasActions;
}


Sprite_Battler.prototype.configureAkeaBattlerPoses = function (battler) {
    let id;
    let posesConfig;
    if (battler.isActor()) {
        id = battler.actorId()
        posesConfig = JSON.parse(this.akeaParameters['Actor Poses']);
    }
    else {
        id = battler.enemyId()
        posesConfig = JSON.parse(this.akeaParameters['Enemy Poses']);
    }
    const poses = posesConfig.find(pose => JSON.parse(pose).id == id);
    if (poses) { this.configakeaAnimatedBSPoses(JSON.parse(JSON.parse(poses).poses)) };
};
Sprite_Battler.prototype.configakeaAnimatedBSPoses = function (posesIndex) {
    const allPoses = JSON.parse(this.akeaParameters['Poses']);
    for (const poseIndex of posesIndex) { this.setSpecificAkeaPose(JSON.parse(allPoses[poseIndex - 1])) };
};
let test;
Sprite_Battler.prototype.setSpecificAkeaPose = function (specificPose) {

    this.akeaMotions[specificPose.name] = {};
    let loop = specificPose.loop == "true" ? true : false;
    let inOut = specificPose.InOut == "true" ? true : false;
    this.akeaMotions[specificPose.name]["index"] = parseInt(specificPose.poseIndex);
    this.akeaMotions[specificPose.name]["loop"] = loop;
    this.akeaMotions[specificPose.name]["speed"] = parseInt(specificPose.frequency);
    this.akeaMotions[specificPose.name]["inOut"] = inOut;

}


let _akeaAnimatedBS_Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler
Sprite_Battler.prototype.setBattler = function (battler) {
    if (battler && battler != this._battler) {
        this.configureAkeaBattlerSheet(battler);
        this.configureAkeaBattlerPoses(battler);
    }
    _akeaAnimatedBS_Sprite_Battler_setBattler.call(this, ...arguments);
    this.swapToSingleBitmap();
    this._zIndex = battler ? battler.screenY() : 0;
};
let _akeaAnimatedBS_Sprite_Battler_initialize = Sprite_Battler.prototype.initialize
Sprite_Battler.prototype.initialize = function () {
    this.akeaParameters = PluginManager.parameters('AkeaAnimatedBattleSystem');
    this._akeaMaxDuration = 0;
    this.akeaMaxFrame = 3;
    this.akeaAnimatedBSMaxHeight = 6;
    this.akeaAnimatedBSMaxWidth = 9;
    this._levitation = 0;
    this._akeaMirroredMoves = false;
    this.akeaMotions = JSON.parse(JSON.stringify(Sprite_Actor.MOTIONS));
    this.setAkeaBaseMotion();
    _akeaAnimatedBS_Sprite_Battler_initialize.call(this, ...arguments);
};
Sprite_Battler.prototype.setAkeaBaseMotion = function () {
    for (let motion in this.akeaMotions) { this.akeaMotions[motion].speed = 12, this.akeaMotions[motion].inOut = false }
};

Sprite_Battler.prototype.configureAkeaBattlerSheet = function (battler) {
    let akeaParametersSheet;
    let id;
    if (battler.isActor()) {
        id = battler.actorId();
        akeaParametersSheet = JSON.parse(this.akeaParameters['Actor Configuration']);
    } else {
        id = battler.enemyId();
        akeaParametersSheet = JSON.parse(this.akeaParameters['Enemy Configuration']);

    }

    const characterSheet = akeaParametersSheet.find(sheet => JSON.parse(sheet).id == id)
    if (characterSheet) { this.setCharacterNewSheet(parseInt(JSON.parse(characterSheet).baseSpritesheet)) }
}
Sprite_Battler.prototype.setCharacterNewSheet = function (baseSheetNum) {
    const akeaParameters = JSON.parse(this.akeaParameters['Frame Configuration']);
    const akeaParametersFrames = JSON.parse(akeaParameters[baseSheetNum - 1]);
    this.akeaMaxFrame = parseInt(akeaParametersFrames.FrameNum);
    this.akeaAnimatedBSMaxHeight = parseInt(akeaParametersFrames.SpritesheetHeight);
    this.akeaAnimatedBSMaxWidth = parseInt(akeaParametersFrames.SpritesheetWidth);
};

Sprite_Battler.prototype.swapToSingleBitmap = function () {
    if (this._mainSprite && this.akeaAnimatedBSMaxHeight == 1 && this.akeaAnimatedBSMaxWidth == 1) {
        this.bitmap = this._mainSprite.bitmap
    } else {
        this.bitmap = new Bitmap(100, 100);
    }

};

Sprite_Battler.prototype.updateAkeaPattern = function () {
    let pattern;
    if (this._akeaInOutFrame) {
        pattern = (this._pattern + this._akeaPatternMotion) % this.akeaMaxFrame;
        if (pattern == 0) {
            this._akeaPatternMotion = 1;
        } else if (pattern == this.akeaMaxFrame - 1) {
            this._akeaPatternMotion = -1;
        }
    }
    else {
        pattern = (this._pattern + 1) % this.akeaMaxFrame;
    }
    return pattern
}
Sprite_Battler.prototype.updateFrame = function () {
    this.updateAkeaFrame()
};
Sprite_Battler.prototype.akeaMotionspeed = function () {
    return this._akeaAnimatedBSFrameSpeed;
};

Sprite_Actor.prototype.startMotion = function (motionType) {
    Sprite_Battler.prototype.startMotion.call(this, ...arguments);
};

Sprite_Actor.prototype.setupMotion = function () {
    if (this._actor.isMotionRequested()) {
        this.startMotion(this._actor.motionType());
        this._actor.clearMotion();
    }
};

Sprite_Actor.prototype.updateFrame = function () {
    Sprite_Battler.prototype.updateFrame.call(this, ...arguments);
};
Sprite_Actor.prototype.updateMotionCount = function () {
    Sprite_Battler.prototype.updateMotionCount.call(this, ...arguments);
};
Sprite_Actor.prototype.refreshMotion = function () {
    Sprite_Battler.prototype.refreshMotion.call(this, ...arguments);
};
Sprite_Actor.prototype.moveToStartPosition = function () {
    Sprite_Battler.prototype.moveToStartPosition.call(this, ...arguments);
};
Sprite_Actor.prototype.setActorHome = function (index) {
    this.setHome(600 + index * 32, 280 + index * 48);
};

Sprite_Actor.prototype.shouldStepForward = function () {
    return this._actor.isInputting();
};

Sprite_Actor.prototype.stepForward = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['stepForward']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    if (this._offsetX == action.getOffsetX() && this._offsetY == action.getOffsetY()) { return }
    this.startMotion(action.getPose());
    this.startMove(action.getOffsetX(), action.getOffsetY(), action.getDuration(), action.getJumpHeight(), action.getLevitation());
};

Sprite_Actor.prototype.stepBack = function () {
    if (this._battler._akeaRetreating) { return }
    Sprite_Battler.prototype.stepBack.call(this, ...arguments);
};


Sprite_Actor.prototype.retreat = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['retreat']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.startMotion(action.getPose());
    this.startMove(action.getOffsetX(), action.getOffsetY(), action.getDuration(), action.getJumpHeight(), action.getLevitation());
};

let _akeaAnimatedBS_Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function () {
    _akeaAnimatedBS_Sprite_Enemy_update.call(this, ...arguments)
    if (this._enemy) { this.updateMotion() };
};

Sprite_Enemy.prototype.updateMotionCount = function () {
    Sprite_Battler.prototype.updateMotionCount.call(this, ...arguments);
};



Sprite_Enemy.prototype.loadBitmap = function (name) {
    let nameSv = "";
    if ($gameSystem.isSideView()) {
        const id = this._battler.enemyId();
        const akeaParametersSheet = JSON.parse(this.akeaParameters['Enemy Configuration']);
        const characterSheet = akeaParametersSheet.find(sheet => JSON.parse(sheet).id == id)
        if (characterSheet) {
            nameSv = JSON.parse(characterSheet).svBattler;
        }
    } else {
        this.bitmap = ImageManager.loadEnemy(name);
    }
    this._mainSprite = new Sprite();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    if (nameSv != "")
        this._mainSprite.bitmap = ImageManager.loadSvEnemy(nameSv);
    else
        this._mainSprite.bitmap = ImageManager.loadSvEnemy(name);
    this.addChild(this._mainSprite);
    this.swapToSingleBitmap();
};

Sprite_Enemy.prototype.mainSprite = function () {
    return this._mainSprite;
};


Sprite_Enemy.prototype.setupMotion = function () {
    if (this._enemy.isMotionRequested()) {
        this.startMotion(this._enemy.motionType());
        this._enemy.clearMotion();
    }
};
Sprite_Enemy.prototype.updateMotion = function () {
    this.setupMotion();
    if (this._enemy.isMotionRefreshRequested()) {
        this.refreshMotion();
        this._enemy.clearMotion();
    }
    this.updateMotionCount();
};

Sprite_Enemy.prototype.refreshMotion = function () {

    Sprite_Battler.prototype.refreshMotion.call(this, ...arguments);
};


Sprite_Enemy.prototype.updatePosition = function () {
    Sprite_Battler.prototype.updatePosition.call(this);
    this.x += this._shake;
};




Sprite_Enemy.prototype.setBattler = function (battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this.moveEnemyToStartPosition();
    this._stateIconSprite.setup(battler);
    this._akeaMirroredMoves = true;
};

Sprite_Enemy.prototype.updateMove = function () {
    Sprite_Battler.prototype.updateMove.call(this);
};


let _akeaAnimatedBS_Sprite_Enemy_initialize = Sprite_Enemy.prototype.initialize;
Sprite_Enemy.prototype.initialize = function (battler) {
    _akeaAnimatedBS_Sprite_Enemy_initialize.call(this, ...arguments);

    this.createShadowSprite();

};


Sprite_Enemy.prototype.moveEnemyToStartPosition = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['entryEnemies']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet.action), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.startMotion(action.getPose());
    this.startMove(0, 0, action.getDuration(), action.getJumpHeight(), action.getLevitation());
    this._offsetX = parseInt(akeaParametersSheet.offsetX);
    this._offsetY = parseInt(akeaParametersSheet.offsetY);

}

Sprite_Battler.prototype.takeDamage = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['damage']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.startMotion(action.getPose());
    this.startMove(0, 0, action.getDuration(), action.getJumpHeight(), action.getLevitation());
}
Sprite_Battler.prototype.evadeHit = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['evade']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.startMotion(action.getPose());
    this.startMove(0, 0, action.getDuration(), action.getJumpHeight(), action.getLevitation());
}


Sprite_Battler.prototype.stepBack = function () {
    if (BattleManager._phase == "action") { return }
    const akeaParametersSheet = JSON.parse(this.akeaParameters['returnAction']);
    this._battler._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet), [], [])
    let action = this._battler.getAkeaAnimatedBSActions().unloadAction();
    this.startMotion(action.getPose());
    this.startMove(0, 0, action.getDuration(), action.getJumpHeight(), action.getLevitation());
}

Sprite_Actor.prototype.startEntryMotion = function () {
    const akeaParametersSheet = JSON.parse(this.akeaParameters['entryActors']);
    if (this._actor && this._actor.canMove()) {
        this._actor._akeaAnimatedBSActions.idToAction(parseInt(akeaParametersSheet.action), [], [])
        let action = this._actor.getAkeaAnimatedBSActions().unloadAction();
        this.startMotion(action.getPose());
        this.startMove(0, 0, action.getDuration(), action.getJumpHeight(), action.getLevitation());
        this._offsetX = parseInt(akeaParametersSheet.offsetX);
        this._offsetY = parseInt(akeaParametersSheet.offsetY);
        const index = this._actor.index();
        this.setHome(eval(akeaParametersSheet.homeX), eval(akeaParametersSheet.homeY))
    } else if (!this.isMoving()) {
        this.refreshMotion();
        this.startMove(0, 0, 0);
    }
};


Sprite_Enemy.prototype.createShadowSprite = function () {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.y = -2;
    this.addChild(this._shadowSprite);
};


Sprite_Enemy.prototype.updateShadow = function () {
    this._shadowSprite.visible = !!this._enemy;
};



Sprite_Enemy.prototype.updateTargetPosition = function () {
    if (this._enemy.canMove() && BattleManager.isEscaped()) {
    } else if (!this.inHomePosition()) {
        this.stepBack();
    }
};

Sprite_Enemy.prototype.updateMain = function () {
    Sprite_Battler.prototype.updateMain.call(this);
    if (this._enemy.isSpriteVisible() && !this.isMoving()) {
        this.updateTargetPosition();
    }
};
Sprite_Enemy.prototype.stepBack = function () {
    if (this._battler._akeaRetreating) { return }
    Sprite_Battler.prototype.stepBack.call(this, ...arguments);
};



let akeaAnimatedBS_Game_Battler_initialize = Game_Battler.prototype.initialize;
Game_Battler.prototype.initialize = function () {
    akeaAnimatedBS_Game_Battler_initialize.call(this, ...arguments)
    this._akeaAnimatedBSActions = new Game_Akea_Actions();
    this._akeaRetreating = false;
};

Game_Battler.prototype.getAkeaAnimatedBSActions = function () {
    return this._akeaAnimatedBSActions;
};

Game_Battler.prototype.performAction = function (action) {
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion("guard");
    } else if (action.isMagicSkill()) {
        //this.requestMotion("spell");
    } else if (action.isSkill()) {
        //this.requestMotion("skill");
    } else if (action.isItem()) {
        this.requestMotion("item");
    }
};

Game_Battler.prototype.performDamage = function () {
    if (this.isSpriteVisible()) {
        this.requestMotion("damage");
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};


Game_Battler.prototype.performEvasion = function () {
    this.requestMotion("evade");
};

Game_Battler.prototype.performMagicEvasion = function () {
    this.requestMotion("evade");
};
Game_Battler.prototype.performEscape = function () {
    if (this.canMove()) {
        this.requestMotion("escape");
    }
};


Game_Battler.prototype.clearAkeaAnimatedBSActions = function () {
    this._akeaAnimatedBSActions = new Game_Akea_Actions();
}

Game_Battler.prototype.requestakeaAnimatedBSAnimation = function (action, targets) {
    let notes;
    if (action.isSkill() || action.isItem()) {
        notes = action.item().note;
    }
    this.translateSkillActions(action, targets, notes)
    this._akeaRetreating = true;
};
Game_Battler.prototype.onBattleStart = function (advantageous) {
    this.setActionState("undecided");
    this.initTpbChargeTime(advantageous);
    this.initTpbTurn();
    if (!this.isPreserveTp()) {
        this.initTp();
    }
};
Game_Battler.prototype.translateSkillActions = function (action, targets, notes) {
    let regex = /(^<akea(\w+)\s*(\S+)*>)/gm;
    this.initialTargets = [];
    for (const target of targets) { this.initialTargets.push(target) }

    this.initialAction = JsonEx.parse(JsonEx.stringify(action));
    do {
        m = regex.exec(notes);
        if (m) {
            this.callAkeaActions(action, targets);
        }
    } while (m);
    this._akeaAnimatedBSActions.addAkeaHit(1, this.initialTargets, "FinishAction", this, this.initialAction);
}


Game_Actor.prototype.performAction = function (action) {
    Game_Battler.prototype.performAction.call(this, action);
};

Game_Actor.prototype.performAttack = function () {
    const weapons = this.weapons();
    const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    const attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            //this.requestMotion("thrust");
        } else if (attackMotion.type === 1) {
            //this.requestMotion("swing");
        } else if (attackMotion.type === 2) {
            //this.requestMotion("missile");
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};

let _akeaAnimatedBS_Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    _akeaAnimatedBS_Game_Actor_initMembers.call(this, ...arguments);
    this._screenX = 0;
    this._screenY = 0;
};

Game_Battler.prototype.updateScreenPosition = function (x, y) {
    this._screenX = x;
    this._screenY = y;
};

Game_Actor.prototype.screenX = function () {
    return this._screenX;
};

Game_Actor.prototype.screenY = function () {
    return this._screenY;
};

Game_Actor.prototype.performDamage = function () {
    Game_Battler.prototype.performDamage.call(this);
};
Game_Enemy.prototype.performAttack = function () {
    //this.requestMotion("thrust");
};
BattleManager.startActionAkea = function (subject, action, targets) {
    //this._phase = "turn";
    this._logWindow.startAction(subject, action, targets);
};
BattleManager.startActionLast = function (subject, action, targets) {
    this._phase = "action";
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    action.applyGlobal();
    this._logWindow.startAction(subject, action, targets);
}
BattleManager.startAction = function () {
    const subject = this._subject;
    const action = subject.currentAction();
    const targets = action.makeTargets();
    this._phase = "action";
    this._action = action;
    this._targets = targets;
    subject.requestakeaAnimatedBSAnimation(action, this._targets)
};

BattleManager.getWindowMethodsLength = function () {
    return this._logWindow._methods.length;
}

Window_BattleLog.prototype.push = function (methodName) {
    const methodArgs = Array.prototype.slice.call(arguments, 1);
    this._methods.push({ name: methodName, params: methodArgs });
};


Window_BattleLog.prototype.callAkeaNextMethod = function (position) {
    if (this._methods.length > 0) {
        const method = this._methods.splice(position, 1)[0];
        if (method.name && this[method.name]) {
            this[method.name].apply(this, method.params);
        } else {
            throw new Error("Method not found: " + method.name);
        }
    }
};

BattleManager.akeaEmptyWindow = function (totalLength) {
    this._logWindow.clear();
    while (this._logWindow._methods.length > totalLength) {
        this._logWindow.callAkeaNextMethod(totalLength);
    }
    //}
};




BattleManager.updateActionNew = function () {
    const subject = this._subject;
    const action = subject.currentAction();
    const targets = action.makeTargets();
    this._targets = targets;
    const target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};


Game_Action.prototype.makePartialDamageValue = function (target, critical, damagePercent) {
    return Math.floor(damagePercent * this.makeDamageValue(target, critical) / 100);
}
Game_Action.prototype.applyAkeaHit = function (target, damagePercent) {
    const result = target.result();
    let value;
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaded = !result.missed && Math.random() < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            value = this.makePartialDamageValue(target, result.critical, damagePercent);
            this.executeDamage(target, value);
        }
    }
    return value;
};

BattleManager.requestzOrderBattlers = function () {
    this._spriteset._battleField.sortChildren();
};


///// AKEA ACTIONS //////////
Spriteset_Battle.prototype.isAnyoneMoving = function () {
    BattleManager.requestzOrderBattlers();
    return this.battlerSprites().some(sprite => (sprite.getAnyActions()));
};

Spriteset_Base.prototype.createAnimationSprite = function (
    targets, animation, mirror, delay
) {
    const mv = this.isMVAnimation(animation);
    const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
    const targetSprites = this.makeTargetSprites(targets);
    const baseDelay = this.animationBaseDelay();
    const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
    if (this.animationShouldMirror(targets[0])) {
        mirror = !mirror;
    }
    sprite.targetObjects = targets;
    sprite.setup(targetSprites, animation, mirror, delay, previous);
    this._effectsContainer.addChild(sprite);
    this._animationSprites.push(sprite);
    sprite._zIndex = 9000;
};


