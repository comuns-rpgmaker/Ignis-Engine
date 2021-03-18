//==========================================================================
// Ignis - Text Database
//----------------------------------------------------------------------------
// 09/25/20 | Version: 1.0.1
// This software is released under the zlib License.
//============================================================================

/*:
 * @target MZ
 * @plugindesc Text Database v.1.0.1
 * @author Reisen (Mauricio Pastana)
 * @url https://www.patreon.com/raizen884

 * @help Ignis - Text Database - this plugins is under zlib license
 * For support and new plugins join our discord server! https://discord.gg/Kh9XXZ2
 * Want to support new creations? be a patreon! 
 * 
 * This plugin allows you to use a database for your messages!
 * This way it is way easier to edit, translate it and for other people to revise it/work together
 * with it.
 * 
 * The texts are stored as json, json is basically a text database, which means while it is
 * text-driven, it acts very similar to an actual database, making it easy to store and edit
 * json files even for people without any knowledge on coding.
 * You can find the example JSON file here!
 * https://github.com/comuns-rpgmaker/Ignis-Engine/blob/master/en.json
 * 
 * You can go deeper about JSON in the internet, but for this plugin, only the very basic
 * is needed.
 * 
 * The files will be stored in your project under the folder you choose in the parameters
 * of the plugin, do remember you CAN make folder trees also like this for example:
 * text/english_texts
 * 
 * After you configure the folder, you just need to add on the parameters of the script the
 * file names to be loaded, and after that you choose the default file, the one that will
 * start loaded.
 * 
 * You can use plugin commands to change between folders and files.
 * 
 * 
 * 
 * @param defaultFolder
 * @type text
 * @default texts
 * @text Default Folder
 * @desc You can choose which folder in your project to hold the text files.
 * 
 * @param textFiles
 * @type text[]
 * @text Text Files
 * @desc Add the name of the files to be loaded, you do not need to add the .json extension to the names
 * 
 * @param defaultFile
 * @type text
 * @text Default File
 * @desc Text file to be used as default.
 * 
 * @command changeFile
 * @text Switch File
 * @desc Switches the current json file.
 * 
 * @arg file
 * @type string
 * 
 * @command changeFolder
 * @text Switch Folder
 * @desc Switches the current folder.
 * 
 * @arg folder
 * @type string
*/

// DON'T MODIFY THIS PART!!!
var Ignis = Ignis || {};
Ignis.TextDatabase = Ignis.TextDatabase || {};
Ignis.TextDatabase.VERSION = [1, 0, 1];
Ignis.TextDatabase.dataTextDB = {};

(() => {
    const pluginName = "IgnisTextDatabase";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "changeFile", args => {
        Ignis.TextDatabase.defaultFile = args.file;
    });

    PluginManager.registerCommand(pluginName, "changeFolder", args => {
        Ignis.TextDatabase.defaultFolder = args.folder;
    });

    DataManager.loadLanguageFile = function (name, src) {
        const xhr = new XMLHttpRequest();
        const url = parameters.defaultFolder.concat("/") + src;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => this.onXhrIgnisLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    };

    DataManager.onXhrIgnisLoad = function (xhr, name, src, url) {
        if (xhr.status < 400) {
            window["Ignis"]["TextDatabase"]["dataTextDB"][name] = JSON.parse(xhr.responseText);
            this.onLoad(window["Ignis"]["TextDatabase"]["dataTextDB"][name]);
        } else {
            this.onXhrError(name, src, url);
        }
    };

    for (const language of JSON.parse(parameters.textFiles)) {
        DataManager.loadLanguageFile(language, language.concat(".json"));
    }

    Ignis.TextDatabase.defaultFile = parameters.defaultFile;

    Ignis.TextDatabase.replaceText = function (text) {
        let regex = /\${([\w|\.]+)}/gm;
        let param;
        do {
            param = regex.exec(text);
            if (param) {
                let newText = this.translateJsonToText(RegExp.$1);
                try {
                    text = text.replace(param[0], eval(newText));
                } catch (e) {
                    text = text.replace(param[0], "Text Not Found");
                }

            }
        } while (param);
        return text;
    }

    Ignis.TextDatabase.translateJsonToText = function (exp) {
        let jsonText = "Ignis.TextDatabase.dataTextDB"
        if (Ignis.TextDatabase.defaultFile != ""){
            jsonText = jsonText.concat("." + Ignis.TextDatabase.defaultFile);
        }
        let expressionArray = exp.split('.');
        for (const expression of expressionArray) {
            jsonText = jsonText.concat("[\"" + expression + "\"]");
        }
        return jsonText;
    };

    const _Window_Base_textSizeEx = Window_Base.prototype.textSizeEx;
    Window_Base.prototype.textSizeEx = function (text) {
        text = Ignis.TextDatabase.replaceText(text);
        return _Window_Base_textSizeEx.call(this, ...arguments);
    };
    const _Game_Message_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function (text) {
        text = Ignis.TextDatabase.replaceText(text);
        _Game_Message_add.call(this, ...arguments);
    };

    const _Bitmap_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
        text = Ignis.TextDatabase.replaceText(text);
        _Bitmap_drawText.call(this, ...arguments);
    };
    /**
     * Replaces %1, %2 and so on in the string to the arguments.
     *
     * @memberof JsExtensions
     * @param {any} ...args The objects to format.
     * @returns {string} A formatted string.
     */
    String.prototype.format = function () {
        return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
    };
})();

