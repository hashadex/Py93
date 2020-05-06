// This script should be loaded at boot.
// Put it in /a/boot/
// TODO: Improve code
// TODO: Minify the code a little bit, but it should be readable
console.log('[Py93Helper] Started execution');
le._apps.py93 = {
    exec: function() {
        var args = this.arg.arguments;
        if (args[0] == "shell" || args[0] == "s") {
            $fs.utils.getMenuOpenWith('/a/Py93/brython/console.html')[0].action();
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
                $log('Py93 Menu: py93compile: usage:\npy93 [compile or c] [?help or h] [filepath] [?--name NAME]\nUse "help" or "h" to see this help message.\nfilepath - path to .py file that needs to be compiled\n--name NAME - output file name.\nExample: "py93 c /a/w93.py --name windows93" => file w93.py in /a/ has been compiled and saved as windows93.html.\n(If there\'s no --name option, the target file name will be the same as the source.)\nWorking command example: py93 c /a/w93.py --name windows93');
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
                    var packages = {}
                    packages.ignore = false
                    attrs.forEach((attr) => {
                        if (attr == '--name') {
                            $log('Detected --name option');
                            let nameid = attrs.indexOf("--name");
                            name = attrs[nameid + 1];
                        } else if (attr == '--packages-ignore' || attr == '-pi') {
                            $log(`Detected ${attr} option`)
                            packages.ignore = true
                        }
                    });
                    /**
                     * Makes an HTML <script> tag depending on blob parameter
                     * @param {string} blob Blob URL of a file that exists on local Windows 93 machine
                     * @returns {string} String with HTML script tag that haves blob parameter as src attribute and that haves 2 tabs (2*4=8 spaces) before the tag itself 
                     */
                    packages.toHTML = function(blob) {
                        var script = `        <script src="` + blob + `"></script>`
                        //$log(script)
                        return script
                    }
                    packages.joinedTags = '        <!-- 4:no packages -->' // * 4 is some kind of error code, i use it to see where something happened
                    if (!packages.ignore) {
                        packages.list = []
                        packages.tags = []
                        //$log($fs.utils.getFileMenu('/a/Py93/packages'))
                        $fs.utils.getFileMenu('/a/Py93/packages')["foldersList"].forEach((name) => {
                            if (name.endsWith('.brython.js')) {
                                //$log('foo')
                                $file.getUrl('/a/Py93/packages/'+name, function(blob) {
                                    if (typeof(blob) == "undefined") {
                                        $log.yellow('py93compile: packages warning: detected a folder that ends with ".brython.js". Please do not create any folders in /a/Py93/packages/')
                                    } else {
                                        //$log('bar')
                                        packages.list.push(blob)
                                        //$log(packages.list)
                                    }
                                })
                            }
                        })
                        /*
                        //$log(packages.list)
                        packages.list.forEach((blob) => {
                            packages.tags.push(packages.toHTML(blob))
                        })
                        //$log(packages.tags)
                        packages.joinedTags = packages.tags.join('\n')
                        //$log(packages.joinedTags)
                        if (packages.joinedTags == "") packages.joinedTags = '        <!-- 5:no packages -->'
                        //$log(packages.joinedTags)
                        */
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
                            //$log(packages.list)
                            //packages.wait = $fs.utils.getFileMenu('/a/Py93/packages')["foldersList"].length * 50 // getting the amount of ms that we need to wait so $file.getUrl will finish the job
                            packages.list.forEach((blob) => {
                                packages.tags.push(packages.toHTML(blob))
                            })
                            //$log(packages.tags)
                            packages.joinedTags = packages.tags.join('\n')
                            //$log(packages.joinedTags)
                            if (packages.joinedTags == "") packages.joinedTags = '        <!-- 5:no packages -->'
                            //$log(packages.joinedTags)
                            var htmlfile = `<!-- \n    This HTML page was generated by Py93 compiler. \n    Generation date: ` + date.toString() + `\n--> \n<!DOCTYPE html> \n<html> \n    <head> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython.min.js"></script> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython_stdlib.js"></script> \n        <!-- packages --> \n${packages.joinedTags}\n        <!-- /packages --> \n        <script type="text/python3" id="r_Py93__script_first"> \n            # PLEASE DO NOT CHANGE OR DELETE THIS CODE. \n            import sys, browser \n            # Overwriting sys.stdout.write so stdout output will go to the textarea \n            class r_Py93__class_WriteStdout: \n                def __init__(self): \n                    self.console = browser.document["console"] \n                def write(self, text): \n                    self.console.text += text \n            sys.stdout = r_Py93__class_WriteStdout() \n            del r_Py93__class_WriteStdout \n            # Now overwriting sys.stderr, but the error messages will be outputed with browser.alert \n            class r_Py93__class_WriteStderr: \n                def __init__(self): \n                    pass \n                def write(self, text): \n                    browser.alert(text) \n            sys.stderr = r_Py93__class_WriteStderr() \n            del r_Py93__class_WriteStderr \n        </script> \n        <style> \n            textarea#console { \n                position: absolute; \n                width: 100%; \n                height: 100%; \n                resize: none; \n                top: 0px; \n                right: 0px; \n                left: 0px; \n                bottom: 0px; \n                background-color: #1d1d1d; \n                color: #ffffff; \n            } \n        </style> \n    </head> \n    <body onload="brython(1)"> \n        <textarea id="console" spellcheck="false" readonly></textarea> \n        <script type="text/python3" id="__main__"> \n` + tabbedStr + `\n        </script> \n    </body> \n</html>`;
                            var filename;
                            if (!(name == null)) {
                                filename = name + '.html';
                            } else {
                                filename = $fs.utils.getName(compFile);
                                filename = $fs.utils.replaceExt(filename, "html");
                            }
                            var compNameFin = 'Py93/compiled/'+filename;
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