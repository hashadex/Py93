// This script should be loaded at boot.
// Put it in /a/boot/
// TODO: Improve code
// TODO: Minify the code a little bit, but it should be readable
console.log('[Py93Helper] Started execution');
le._apps.py93 = {
    exec: function() {
        var args = this.arg.arguments;
        if (args[0] == "shell" || args[0] == "s") {
            $fs.utils.getMenuOpenWith('/a/Py93/console.html')[0].action();
        } else if (args[0] == "help" || args[0] == "h") {
            $log('Py93 Menu: usage:\nh, help - print this help message\ns, shell - launch Py93 shell\nc, compile - launch py93compile (Py93 Compiler)\nUse py93 [compile or c] [help or h] to see py93compile usage.');
        } else if (args[0] == "compile" || args[0] == "c") {
            if (
                this.arg.command == "py93 compile" ||
                this.arg.command == "py93 compile " ||
                this.arg.command == "py93 c" ||
                this.arg.command == "py93 c " ||
                this.arg.command == "py93 compile help" ||
                this.arg.command == "py93 compile h" ||
                this.arg.command == "py93 c help" ||
                this.arg.command == "py93 c h"
            ) {
                $log('Py93 Menu: py93compile: usage:\npy93 [compile or c] [help or h] [filepath] [--name NAME] [--packages-ignore or -pi] [-o or --out OUTDIR]\n===========================================================\nUse "help" or "h" to see this help message.\nfilepath - path to .py file that needs to be compiled\n--name NAME - output file name.\nExample: "py93 c /a/w93.py --name windows93" => file w93.py in /a/ has been compiled and saved as windows93.html.\n(If there\'s no --name option, the target file name will be the same as the source.)\n--packages-ignore or -pi - use these options if don\'t want to load packages from "packages" folder in the compiled file.\n-o or --out OUTDIR - use these options to set the output directory.\n(If there\'s no --out or -o option, the standard output directory will be used (/a/Py93/compiled/))\nWorking command example: py93 c /a/w93.py --name windows93 -pi --out a/desktop');
            } else {
                let attrs = this.arg.command.split(' ');
                var compFile;
                compFile = attrs[2];
                if (compFile[0] == '/') compFile = compFile.substr(1);
                if (compFile[0] == 'a' && $fs.utils.getExt(compFile) == 'py') {
                    success = true;
                } else {
                    success = false;
                    if (compFile[0] == 'c') {
                        $log.red('py93compile: compiler error: can\'t get file from /c/');
                    }
                    if ($fs.utils.exist(compFile) == false) {
                        $log.red('py93compile: compiler error: file does not exist');
                    }
                    if (!($fs.utils.getExt(compFile) == 'py')) {
                        $log.red('py93compile: compiler error: only .py files supported');
                    }
                    if (!(compFile[0] == 'c') && !($fs.utils.exist(compFile) == false) && !(!($fs.utils.getExt(compFile) == 'py'))) {
                        $log.red('py93compile: compiler error: can\'t get file\nDebug information: 1, unknown reason');
                    }
                }
                if (success) {
                    compFile = compFile.substr(2);
                    var outConts;
                    function dbCallback(a, file) {
                        outConts = file;
                    }
                    $db.getRaw(compFile, dbCallback);
                    var name = null;
                    var packages = {};
                    var stdoutdir = /*'/a/*/'Py93/compiled/';
                    var outdir = /*'/a/*/'Py93/compiled/';
                    packages.ignore = false
                    attrs.forEach((attr) => {
                        if (attr == '--name') {
                            $log('Detected --name option');
                            let nameid = attrs.indexOf("--name");
                            name = attrs[nameid + 1];
                        } else if (attr == '--packages-ignore' || attr == '-pi') {
                            $log(`Detected ${attr} option`)
                            packages.ignore = true
                        } else if (attr == '--out' || attr == '-o') {
                            $log(`Detected ${attr} option`)
                            let outid = attrs.indexOf(`${attr}`)
                            let wrong = false;
                            outdir = attrs[outid + 1]
                            // doing some validation
                            if (outdir[0] == "/") outdir = outdir.substr(1) // a/path/
                            if (outdir[0] != "a") {
                                wrong = true;
                                if (outdir[0] == "c") $log.red('py93compile: compiler error: can\'t write to /c/, using standard output directory.');
                                else $log.red('py93compile: compiler error: wrong output directory, using standard output directory.');
                            } else {
                                outdir = outdir.substr(1) // /path/
                            }
                            if (!wrong) {
                                outdir = outdir.substr(1) // path/
                                if ('/' != outdir.slice(-1)) { // path => path/
                                    outdir += '/';
                                }
                            } else {
                                outdir = stdoutdir;
                            }
                        }
                    });
                    /**
                     * Makes an HTML <script> tag depending on blob parameter
                     * @param {string} blob Blob URL of a file that exists on local Windows 93 machine
                     * @returns {string} String with HTML script tag that haves blob parameter as src attribute and that haves 2 tabs (2*4=8 spaces) before the tag itself 
                     */
                    packages.toHTML = function(blob) {
                        var script = `        <script src="` + blob + `"></script>`
                        return script
                    }
                    packages.joinedTags = '        <!-- 4:no packages -->' // * 4 is some kind of error code, i use it for debugging
                    if (!packages.ignore) {
                        packages.list = []
                        packages.tags = []
                        $fs.utils.getFileMenu('/a/Py93/packages')["foldersList"].forEach((name) => {
                            if (name.endsWith('.brython.js')) {
                                $file.getUrl('/a/Py93/packages/'+name, function(blob) {
                                    packages.list.push(blob)
                                })
                            }
                        })
                    }
                    function compile() {
                        if (outConts == 'null') {
                            $log.red('py93compile: compiler error: file not found\nTrying to do what you tried to do again may solve this problem.');
                        } else if (outConts == null) {
                            $log.red('py93compile: compiler error: can\'t get file\nDebug information: 2, outConts is null\nTrying to do what you tried to do again may solve this problem.');
                        } else if (outConts == undefined) {
                            $log.red('py93compile: compiler error: can\'t get file\nDebug information: 3, outConts is undefined');
                        } else {
                            $log('Started compiling...');
                            var spl = outConts.split('\n');
                            var tabs = '            ';
                            var tabbed = [];
                            spl.forEach((element) => {
                                if (typeof(element) == 'string') {
                                    tabbed.push(tabs + element);
                                }
                            });
                            tabbedStr = tabbed.join('\n');
                            var date = new Date();
                            if (!packages.ignore) {
                                packages.list.forEach((blob) => {
                                    packages.tags.push(packages.toHTML(blob))
                                })
                                packages.joinedTags = packages.tags.join('\n')
                                if (packages.joinedTags == "") packages.joinedTags = '        <!-- 5:no packages -->'
                            }
                            var htmlfile = `<!-- \n    This HTML page was generated by Py93 compiler. \n    Generation date: ` + date.toString() + `\n--> \n<!DOCTYPE html> \n<html> \n    <head> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython.min.js"></script> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython_stdlib.js"></script> \n        <!-- packages --> \n${packages.joinedTags}\n        <!-- /packages --> \n        <script type="text/python3" id="r_Py93__script_first"> \n            # PLEASE DO NOT CHANGE OR DELETE THIS CODE. \n            import sys, browser \n            # Overwriting sys.stdout.write so stdout output will go to the textarea \n            class r_Py93__class_WriteStdout: \n                def __init__(self): \n                    self.console = browser.document["console"] \n                def write(self, text): \n                    self.console.text += text \n            sys.stdout = r_Py93__class_WriteStdout() \n            del r_Py93__class_WriteStdout \n            # Now overwriting sys.stderr, but the error messages will be outputed with browser.alert \n            class r_Py93__class_WriteStderr: \n                def __init__(self): \n                    pass \n                def write(self, text): \n                    browser.alert(text) \n            sys.stderr = r_Py93__class_WriteStderr() \n            del r_Py93__class_WriteStderr \n        </script> \n        <style> \n            textarea#console { \n                position: absolute; \n                width: 100%; \n                height: 100%; \n                resize: none; \n                top: 0px; \n                right: 0px; \n                left: 0px; \n                bottom: 0px; \n                background-color: #1d1d1d; \n                color: #ffffff; \n            } \n        </style> \n    </head> \n    <body onload="brython(1)"> \n        <textarea id="console" spellcheck="false" readonly></textarea> \n        <script type="text/python3" id="__main__"> \n` + tabbedStr + `\n        </script> \n    </body> \n</html>`;
                            var filename;
                            if (!(name == null)) {
                                filename = name + '.html';
                            } else {
                                filename = $fs.utils.getName(compFile);
                                filename = $fs.utils.replaceExt(filename, "html");
                            }
                            var compNameFin = outdir + filename;
                            //$log(compNameFin)
                            $db.set(compNameFin, htmlfile);
                            $log.green('Finished compilation.\nCompiled file path: /a/' + compNameFin + '\nWrite "$explorer.refresh();" to the terminal to make compiled file visible.'); // FIXME: Need to fix a bug when using $explorer.refresh() in the script does nothing
                        }
                    }
                    setTimeout(compile, 500);
                }
            }
        } else {
            $log('Py93 Menu: usage:\nh, help - print this help message\ns, shell - launch Py93 shell\nc, compile - launch py93compile (Py93 Compiler)\nUse py93 [compile or c] [help or h] to see py93compile usage.');
        }
    },
    hascli: true,
    terminal: true
};
console.log('[Py93Helper] Finished execution.');
