// This script should be loaded at boot.
// Put it in /a/boot/
// _variableName <= this variable is unused
// TODO: Improve code
// TODO: Minify the code a little bit, but it should be readable

/* jshint -W119 */
/* jshint -W004 */
/* jshint -W038 */

console.log('[Py93Helper] Started execution');
/**
 * @description Py93's stuff
 * @global
 */
var $py93 = {};

$py93.launchShell = function() {
    $fs.utils.getMenuOpenWith('/a/Py93/console.html')[0].action();
};

/**
 * @description Py93 Package Manager's stuff
 */
$py93.pm = {};

/**
 * An array that contains all supported by this version
 * versions of package JSON file syntax.
 */
$py93.pm.supportedVers = [1];

/**
 * Shell will get data from shellGate using window.parent
 */
$py93.shellGate = {};

$py93.shellGate.ignore = false;
$py93.shellGate.pkgConts = [];
$py93.help = 'Py93 Menu: usage:\nh, help - print this help message\ns, shell - launch Py93 shell\nc, compile - launch py93compile (Py93 Compiler)\npm - launch package manager\nUse py93 [compile or c] [help or h] to see py93compile usage.\nUse py93 [s or shell] [--help or -h] to see shell launcher options.\nUse py93 pm [help or h] to see package manager help message';
le._apps.py93 = {
    exec: function() {
        var args = this.arg.arguments;
        if (args[0] == "shell" || args[0] == "s") {
            $py93.shellGate.ignore = false;
            var dry = false;
            var shellAttrs = this.arg.command.split(' ');
            shellAttrs.forEach((attr) => {
                if (attr == "--packages-ignore" || attr == "-pi") {
                    $log(`Detected ${attr} option`);
                    $py93.shellGate.ignore = true;
                } else if (attr == '-h' || attr == '--help') {
                    dry = true;
                    $log(`Detected ${attr} option`);
                    $log('Py93 Menu: Shell launcher: usage:\npy93 [s or shell] [-h or --help] [-pi or --packages-ignore]\n-h or --help - print this help message\n-pi or --packages-ignore - use these options if you don\'t want to load packages from packages folder in the shell.');
                }
            });
            if (!dry) {
                if (!$py93.shellGate.ignore) $log('Creating list of packages...');
                $py93.shellGate.pkgConts = [];
                $py93.shellGate.pmPkgUrls = [];
                $db.getRaw('Py93/pm/data.json', function(_a, file) {
                    var pmDataJSON = null;
                    if (typeof file == "string") {
                        try {
                            pmDataJSON = JSON.parse(file);
                        } catch(e) {
                            if (!$py93.shellGate.ignore) $log.red('Py93 Menu: Shell launcher: JSON error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager will be not loaded.\nMore info in the JavaScript console.');
                            console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                        }
                        if (pmDataJSON != null) {
                            pmDataJSON.installed.forEach((package) => {
                                $py93.shellGate.pmPkgUrls.push(package.install.package);
                            });
                        }
                    } else if (typeof file == "object") {
                        file.text().then(function(filestr) {
                            try {
                                pmDataJSON = JSON.parse(filestr);
                            } catch(e) {
                                if (!$py93.shellGate.ignore) $log.red('Py93 Menu: Shell launcher: JSON error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager will be not loaded.\nMore info in the JavaScript console.');
                                console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                            }
                            if (pmDataJSON != undefined) {
                                pmDataJSON.installed.forEach((package) => {
                                    $py93.shellGate.pmPkgUrls.push(package.install.package);
                                });
                            }
                        });
                    }
                });
                $fs.utils.getFileMenu('/a/Py93/packages').foldersList.forEach((name) => {
                    $db.getRaw('Py93/packages/'+name, function(_a, file) {
                        if (typeof file == 'string') {
                            $py93.shellGate.pkgConts.push(file);
                        } else if (typeof file == 'object') {
                            file.text().then(function(filestr) {
                                $py93.shellGate.pkgConts.push(filestr);
                            });
                        }
                    });
                });
                setTimeout($py93.launchShell, 500);
            }
        } else if (args[0] == "help" || args[0] == "h") {
            $log($py93.help);
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
                var attrs = this.arg.command.split(' ');
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
                    if ($fs.utils.getExt(compFile) != 'py') {
                        $log.red('py93compile: compiler error: only .py files supported');
                    }
                    if (compFile[0] != 'c' && $fs.utils.exist(compFile) != false && $fs.utils.getExt(compFile) == 'py') {
                        $log.red('py93compile: compiler error: can\'t get file\nDebug information: 1, unknown reason');
                    }
                }
                if (success) {
                    compFile = compFile.substr(2);
                    var outConts;
                    var dbCallback = function(_a, file) {
                        if (typeof file == "string") outConts = file;
                        else if (typeof file == "object") file.text().then(function(fileConts) {
                            outConts = fileConts;
                        });
                    };
                    $db.getRaw(compFile, dbCallback);
                    var name = null;
                    var packages = {};
                    var stdoutdir = /*'/a/*/'Py93/compiled/';
                    var outdir = /*'/a/*/'Py93/compiled/';
                    packages.ignore = false;
                    attrs.forEach((attr) => {
                        if (attr == '--name') {
                            $log('Detected --name option');
                            var nameid = attrs.indexOf("--name");
                            name = attrs[nameid + 1];
                        } else if (attr == '--packages-ignore' || attr == '-pi') {
                            $log(`Detected ${attr} option`);
                            packages.ignore = true;
                        } else if (attr == '--out' || attr == '-o') {
                            $log(`Detected ${attr} option`);
                            var outid = attrs.indexOf(`${attr}`);
                            var wrong = false;
                            outdir = attrs[outid + 1];
                            // doing some validation
                            if (outdir[0] == "/") outdir = outdir.substr(1); // a/path/
                            if (outdir[0] != "a") {
                                wrong = true;
                                if (outdir[0] == "c") $log.red('py93compile: compiler error: can\'t write to /c/, using standard output directory.');
                                else $log.red('py93compile: compiler error: wrong output directory, using standard output directory.');
                            } else {
                                outdir = outdir.substr(1); // /path/
                            }
                            if (!wrong) {
                                outdir = outdir.substr(1); // path/
                                if ('/' != outdir.slice(-1)) { // path => path/
                                    outdir += '/';
                                }
                            } else {
                                outdir = stdoutdir;
                            }
                        }
                    });
                    /**
                     * Makes an HTML <script> tag depending on url parameter
                     * @param {string} url Any URL, actually can be any value that can be converted to string
                     * @returns {string} String with HTML script tag that haves url parameter as src attribute and that haves 2 tabs (2*4=8 spaces) before the tag itself 
                     */
                    packages.toHTML = function(url) {
                        var script = `        <script src="` + url + `"></script>`;
                        return script;
                    };
                    packages.joinedTags = '        <!-- 4:no packages -->'; // * 4 is some kind of error code, i use it for debugging
                    var pmData;
                    if (!packages.ignore) {
                        packages.list = [];
                        packages.tags = [];
                        $db.getRaw('Py93/pm/data.json', function(_a, file) {
                            if (typeof file == "string") {
                                pmData = file;
                            } else if (typeof file == "object") {
                                file.text().then(function(filestr) {
                                    pmData = filestr;
                                });
                            }
                        });
                        $fs.utils.getFileMenu('/a/Py93/packages').foldersList.forEach((name) => {
                            if (name.endsWith('.brython.js')) {
                                $file.getUrl('/a/Py93/packages/'+name, function(blob) {
                                    packages.list.push(blob);
                                });
                            }
                        });
                    }
                    var compile = function() {
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
                                if (typeof element == 'string') {
                                    tabbed.push(tabs + element);
                                }
                            });
                            tabbedStr = tabbed.join('\n');
                            var date = new Date();
                            if (!packages.ignore) {
                                var pmDataJSON = null;
                                try {
                                    pmDataJSON = JSON.parse(pmData);
                                } catch(e) {
                                    $log.red('py93compile: compiler error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager would be not loaded.\nMore info in the JavaScript console.');
                                    console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                                }
                                if (pmDataJSON != null) {
                                    pmDataJSON.installed.forEach((package) => {
                                        packages.list.push(package.install.package);
                                    });
                                }
                                packages.list.forEach((url) => {
                                    packages.tags.push(packages.toHTML(url));
                                });
                                packages.joinedTags = packages.tags.join('\n');
                                if (packages.joinedTags == "") packages.joinedTags = '        <!-- 5:no packages -->';
                            }
                            var htmlfile = `<!-- \n    This HTML page was generated by Py93 compiler. \n    Generation date: ` + date.toString() + `\n--> \n<!DOCTYPE html> \n<html> \n    <head> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython.min.js"></script> \n        <script src="https://cdnjs.cloudflare.com/ajax/libs/brython/3.8.8/brython_stdlib.js"></script> \n        <!-- packages --> \n${packages.joinedTags}\n        <!-- /packages --> \n        <script type="text/python3" id="r_Py93__script_first"> \n            # PLEASE DO NOT CHANGE OR DELETE THIS CODE. \n            import sys, browser \n            # Overwriting sys.stdout.write so stdout output will go to the textarea \n            class r_Py93__class_WriteStdout: \n                def __init__(self): \n                    self.console = browser.document["console"] \n                def write(self, text): \n                    self.console.text += text \n            sys.stdout = r_Py93__class_WriteStdout() \n            del r_Py93__class_WriteStdout \n            # Now overwriting sys.stderr, but the error messages will be outputed with browser.alert \n            class r_Py93__class_WriteStderr: \n                def __init__(self): \n                    pass \n                def write(self, text): \n                    browser.alert(text) \n            sys.stderr = r_Py93__class_WriteStderr() \n            del r_Py93__class_WriteStderr \n        </script> \n        <style> \n            textarea#console { \n                position: absolute; \n                width: 100%; \n                height: 100%; \n                resize: none; \n                top: 0px; \n                right: 0px; \n                left: 0px; \n                bottom: 0px; \n                background-color: #1d1d1d; \n                color: #ffffff; \n            } \n        </style> \n    </head> \n    <body onload="brython(1)"> \n        <textarea id="console" spellcheck="false" readonly></textarea> \n        <script type="text/python3" id="__main__"> \n` + tabbedStr + `\n        </script> \n    </body> \n</html>`;
                            var filename;
                            if (name != null) {
                                filename = name + '.html';
                            } else {
                                filename = $fs.utils.getName(compFile);
                                filename = $fs.utils.replaceExt(filename, "html");
                            }
                            var compNameFin = outdir + filename;
                            //$log(compNameFin)
                            //$log(packages)
                            $db.set(compNameFin, htmlfile);
                            $log.green('Finished compilation.\nCompiled file path: /a/' + compNameFin + '\nWrite "$explorer.refresh();" to the terminal to make compiled file visible.'); // FIXME: Need to fix a bug when using $explorer.refresh() in the script does nothing
                        }
                    };
                    setTimeout(compile, 650);
                }
            }
        } else if (args[0] == "pm") {
            var help = 'py93pm: usage:\npy93 pm [help or h] [add URL or a URL] [rem NAME or r NAME] [u NAME or upgrade NAME] [info NAME or i NAME] [list]\n===========================================================\nhelp or h - print this help message\nadd URL, a URL - install a package, URL is a link to JSON package file that you want to install\nrem NAME, r NAME - remove an installed package, NAME is name of the package that you want to remove\nlist, l - output a list of packages that you have installed\nu NAME, upgrade NAME - try to upgrade a package, NAME is the name of package you want to upgrade\ninfo NAME, i NAME - get info about installed package which name is NAME.\nExample: py93 pm i py93-packagetest => print info about installed package "py93-packagetest"';
            if (
                this.arg.command == "py93 pm" ||
                this.arg.command == "py93 pm " ||
                this.arg.command == "py93 pm help" ||
                this.arg.command == "py93 pm help " ||
                this.arg.command == "py93 pm h" ||
                this.arg.command == "py93 pm h "
            ) {
                $log(help);
            } else {
                if (args[1] == "add" || args[1] == "a") {
                    var attrs = this.arg.command.split(' ');
                    var reAdd = false;
                    attrs.forEach((attr) => {
                        if (attr == "--readd" || attr == "-r") {
                            reAdd = true;
                        } 
                    });
                    var xhr = new XMLHttpRequest();
                    $log('Configuring request...');
                    xhr.open("GET", args[2], true);
                    xhr.timeout = 30000;
                    xhr.ontimeout = function() {
                        $log.red('py93pm: error: request timed out');
                    };
                    xhr.onerror = function(e) {
                        $log.red('py93pm: request error: request failed, look for more info in the JavaScript console.');
                        console.error(new Error(`Request failed.\n${e}`));
                    };
                    xhr.onload = function() {
                        console.log(`py93pm: onload: ${xhr.status}, ${xhr.statusText}`);
                        if (xhr.status <= 299 && xhr.status >= 200) {
                            if (xhr.getResponseHeader("Content-Type").startsWith('application/json')) {
                                var success = true;
                                try {
                                    var respJSON = JSON.parse(xhr.response);
                                } catch (e) {
                                    success = false;
                                    $log.red('py93pm: JSON error: failed to parse JSON, more info in the JavaScript console');
                                    console.error(new Error(e.stack)); // we're not throwing the error, because there will be "Uncaught" at the start of error text
                                }
                                if (success) {
                                    /**
                                     * This object contains 8 booleans for validating package JSON file.
                                     * After validating, all booleans should be equal to true.
                                     */
                                    var checks = {
                                        versionExist: false, // True if "version" exist
                                        versionIsNum: false, // True if "version" is a number
                                        versionSupp: false, // True if package JSON file syntax (defined in "version") is supported by this version
                                        metaExist: false, // True if "meta" exist and typeof is "object"
                                        meta_titleExist: false, // True if "title" in "meta" exist
                                        meta_compVerExist: false, // True if "compVer" in "meta" exist
                                        installExist: false, // True if "install" exist and typeof is "object"
                                        install_packageExist: false // True if "package" in "install" exist and typeof is "string"
                                    };
                                    // Validating JSON
                                    if (typeof respJSON == "object") { // just double-checked to make absolutely sure, this if statement may be removed in future
                                        if (typeof respJSON.version != "undefined") checks.versionExist = true;
                                        if (typeof respJSON.version == "number") checks.versionIsNum = true;
                                        if ($py93.pm.supportedVers.includes(respJSON.version)) checks.versionSupp = true;
                                        if (typeof respJSON.meta != "undefined" && typeof respJSON.meta == "object") {
                                            checks.metaExist = true;
                                            if (typeof respJSON.meta.title != "undefined") checks.meta_titleExist = true;
                                            if (typeof respJSON.meta.compVer != "undefined") checks.meta_compVerExist = true;
                                        }
                                        if (typeof respJSON.install == "object") {
                                            checks.installExist = true;
                                            if (typeof respJSON.install.package != "undefined" || typeof respJSON.install.package == "string") checks.install_packageExist = true;
                                        }

                                        $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                            if (typeof file == "string") {
                                                var pmData = null;
                                                try {
                                                    pmData = JSON.parse(file);
                                                } catch(e) {
                                                    $log.red('py93compile: compiler error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager would be not loaded.\nMore info in the JavaScript console.');
                                                    console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                                                }
                                                if (pmData != null) {
                                                    var found = false;
                                                    pmData.installed.forEach((package) => {
                                                        if (package.meta.title == respJSON.meta.title) {
                                                            found = true;
                                                        }
                                                    });
                                                    if (!found) {
                                                        install();
                                                    } else {
                                                        if (reAdd) {
                                                            pmData.installed = pmData.installed.filter((package, index) => {
                                                                if (package.meta.title == respJSON.meta.title) {
                                                                    $log(`Removed package "${package.meta.title}", index ${index}`);
                                                                    return false;
                                                                } else {
                                                                    return true;
                                                                }
                                                            });
                                                            $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                            //console.log(pmData)
                                                            setTimeout(install, 200);
                                                        } else {
                                                            $log.red(`py93pm: error: found package with title "${respJSON.meta.title}" installed.\nUse --readd or -r to overwrite installations of package "${respJSON.meta.title}".`);
                                                        }
                                                    }
                                                }
                                            }
                                        });

                                        var install = function() {
                                            //console.log(pmData)
                                            if (Object.values(checks).every(Boolean)) {
                                                $log(`Package "${respJSON.meta.title}"\n===========================================================`);
                                                $log(`Title: ${respJSON.meta.title}`);
                                                if (typeof respJSON.meta.author != "undefined") $log(`Author: ${respJSON.meta.author}`);
                                                $log(`Version: ${(typeof respJSON.meta.dispVer != "undefined") ? respJSON.meta.dispVer : respJSON.meta.compVer}`);
                                                if (typeof respJSON.meta.license != 'undefined') $log(`License: ${respJSON.meta.license}`);
                                                if (typeof respJSON.meta.packageSite != 'undefined') $log(`Package site/repository: ${respJSON.meta.packageSite}`);
                                                if (confirm(`You are going to install package "${respJSON.meta.title}". Are you sure?`)) {
                                                    // yay, finally we installing it!
                                                    var pmData;
                                                    $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                                        if (typeof file == "object") {
                                                            file.text().then(function(filestr) {
                                                                try {
                                                                    pmData = JSON.parse(filestr);
                                                                } catch(e) {
                                                                    $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                    console.error(new Error(e.stack));
                                                                }
                                                                if (typeof pmData != "undefined") {
                                                                    pmData.installed.push(respJSON);
                                                                    $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                                }
                                                            });
                                                        } else if (typeof file == "string") {
                                                            try {
                                                                pmData = JSON.parse(file);
                                                            } catch(e) {
                                                                $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                console.error(new Error(e.stack));
                                                            }
                                                            if (typeof pmData != "undefined") {
                                                                pmData.installed.push(respJSON);
                                                                $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                            }
                                                        }
                                                    });
                                                }
                                            } else {
                                                //$log(checks)
                                                //$log(checksNum)
                                                $log.red('py93pm: error: not all checks of JSON package file were successful.\nLook for more info in the JavaScript console.');
                                                console.error(new Error('Not all checks of JSON package file were successful.'));
                                                if (checks.versionExist != true) console.log(new Error('Check "versionExist" was not successful.'));
                                                if (checks.versionIsNum != true) console.log(new Error('Check "versionIsNum" was not successful.'));
                                                if (checks.versionSupp != true) console.log(new Error('Check "versionSupp" was not successful.'));
                                                if (checks.metaExist != true) console.log(new Error('Check "metaExist" was not successful.'));
                                                if (checks.meta_titleExist != true) console.log(new Error('Check "meta_titleExist" was not successful.'));
                                                if (checks.meta_compVerExist != true) console.log(new Error('Check "meta_compVerExist" was not successful.'));
                                                if (checks.installExist != true) console.log(new Error('Check "installExist" was not successful.'));
                                                if (checks.install_packageExist != true) console.log(new Error('Check "install_packageExist" was not successful.'));
                                            }
                                        };
                                    } else {
                                        new Error("respJSON is not object");
                                    }
                                }
                            } else {
                                $log.red(`py93pm: error: response header "Content-Type" value should start with "application/json", but "Content-Type" value is ${xhr.getResponseHeader('Content-Type')}`);
                            }
                        } else {
                            $log.red(`py93pm: HTTP error: ${xhr.status} ${xhr.statusText}`);
                        }
                    };
                    xhr.send();
                    $log('Sended the request, now awaiting response. This can take up to 30 seconds.');
                } else if (args[1] == "rem" || args[1] == "r") {
                    $db.getRaw('Py93/pm/data.json', function(_a, file) {
                        if (typeof file == "string") {
                            var pmDataJSON = null;
                            try {
                                pmDataJSON = JSON.parse(file);
                            } catch(e) {
                                $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                console.error(new Error(e.stack));
                            }
                            if (pmDataJSON != null) {
                                $log(`Searching for package "${args[2]}"...`);
                                var found = false;
                                pmDataJSON.installed.forEach((package, index) => {
                                    if (package.meta.title == args[2]) {
                                        $log(`Found package "${package.meta.title}", index ${index}`);
                                        found = true;
                                    }
                                });
                                if (found) {
                                    pmDataJSON.installed = pmDataJSON.installed.filter((package, index) => {
                                        if (package.meta.title == args[2]) {
                                            $log(`Removed package "${package.meta.title}", index ${index}`);
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    });
                                    $db.set('Py93/pm/data.json', JSON.stringify(pmDataJSON));
                                } else {
                                    $log.red(`py93pm: error: package "${args[2]}" not found`);
                                }
                            }
                        }
                    });
                } else if (args[1] == "list" || args[1] == "l") {
                    $db.getRaw('Py93/pm/data.json', function(_a, file) {
                        if (typeof file == "string") {
                            var pmDataJSON = null;
                            try {
                                pmDataJSON = JSON.parse(file);
                            } catch(e) {
                                $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                console.error(new Error(e.stack));
                            }
                            if (pmDataJSON != null) {
                                $log(`You have ${pmDataJSON.installed.length} packages installed.`);
                                pmDataJSON.installed.forEach((package) => {
                                    $log(`\nTitle: ${package.meta.title}\nVersion: ${(typeof package.meta.dispVer != "undefined") ? package.meta.dispVer : package.meta.compVer}`);
                                });
                            }
                        } else if (typeof file == "object") {
                            file.text().then(function(filestr) {
                                var pmDataJSON = null;
                                try {
                                    pmDataJSON = JSON.parse(filestr);
                                } catch(e) {
                                    $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                    console.error(new Error(e.stack));
                                }
                                if (pmDataJSON != null) {
                                    $log(`You have ${pmDataJSON.installed.length} packages installed.`);
                                    pmDataJSON.installed.forEach((package) => {
                                        $log(`\nTitle: ${package.meta.title}\nVersion: ${(typeof package.meta.dispVer != "undefined") ? package.meta.dispVer : package.meta.compVer}}`);
                                    });
                                }
                            });
                        }
                    });
                } else if (args[1] == "upgrade" || args[1] == "u") {
                    $db.getRaw('Py93/pm/data.json', function(_a, file) {
                        if (typeof file == "string") {
                            var pmDataJSON = null;
                            try {
                                pmDataJSON = JSON.parse(file);
                            } catch(e) {
                                $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                console.error(new Error(e.stack));
                            }
                            if (pmDataJSON != null) {
                                $log(`Searching for package "${args[2]}"...`);
                                var found = false;
                                pmDataJSON.installed.forEach((package, index) => {
                                    if (package.meta.title == args[2]) {
                                        $log(`Found package "${package.meta.title}", index ${index}`);
                                        found = true;
                                    }
                                });
                                if (found) {
                                    var foundSelf = false;
                                    var packageSelf = null;
                                    var oldCompVer;
                                    pmDataJSON.installed.forEach((package) => {
                                        if (package.meta.title == args[2] && !foundSelf) {
                                            oldCompVer = package.meta.compVer;
                                            if (typeof package.install.self != "undefined") {
                                                //$log(`${package.meta.title} ${args[2]} ${package.install.self}`)
                                                foundSelf = true;
                                                packageSelf = package.install.self;
                                            } 
                                        }
                                    });
                                    //$log(packageSelf)
                                    //$log(foundSelf)
                                    if (foundSelf) {
                                        var xhr = new XMLHttpRequest();
                                        $log('Configuring request...');
                                        xhr.open("GET", packageSelf, true);
                                        xhr.timeout = 30000;
                                        xhr.ontimeout = function() {
                                            $log.red('py93pm: error: request timed out');
                                        };
                                        xhr.onerror = function(e) {
                                            $log.red('py93pm: request error: request failed, look for more info in the JavaScript console.');
                                            console.error(new Error(`Request failed.\n${e}`));
                                        };
                                        xhr.onload = function() {
                                            console.log(`py93pm: onload: ${xhr.status}, ${xhr.statusText}`);
                                            if (xhr.status <= 299 && xhr.status >= 200) {
                                                if (xhr.getResponseHeader("Content-Type").startsWith('application/json')) {
                                                    var success = true;
                                                    try {
                                                        var respJSON = JSON.parse(xhr.response);
                                                    } catch (e) {
                                                        success = false;
                                                        $log.red('py93pm: JSON error: failed to parse JSON, more info in the JavaScript console');
                                                        console.error(new Error(e.stack)); // we're not throwing the error, because there will be "Uncaught" at the start of error text
                                                    }
                                                    if (success) {
                                                        /**
                                                         * This object contains 8 booleans for validating package JSON file.
                                                         * After validating, all booleans should be equal to true.
                                                         */
                                                        var checks = {
                                                            versionExist: false, // True if "version" exist
                                                            versionIsNum: false, // True if "version" is a number
                                                            versionSupp: false, // True if package JSON file syntax (defined in "version") is supported by this version
                                                            metaExist: false, // True if "meta" exist and typeof is "object"
                                                            meta_titleExist: false, // True if "title" in "meta" exist
                                                            meta_compVerExist: false, // True if "compVer" in "meta" exist
                                                            installExist: false, // True if "install" exist and typeof is "object"
                                                            install_packageExist: false // True if "package" in "install" exist and typeof is "string"
                                                        };
                                                        // Validating JSON
                                                        if (typeof respJSON == "object") { // just double-checked to make absolutely sure, this if statement may be removed in future
                                                            if (typeof respJSON.version != "undefined") checks.versionExist = true;
                                                            if (typeof respJSON.version == "number") checks.versionIsNum = true;
                                                            if ($py93.pm.supportedVers.includes(respJSON.version)) checks.versionSupp = true;
                                                            if (typeof respJSON.meta != "undefined" && typeof respJSON.meta == "object") {
                                                                checks.metaExist = true;
                                                                if (typeof respJSON.meta.title != "undefined") checks.meta_titleExist = true;
                                                                if (typeof respJSON.meta.compVer != "undefined") checks.meta_compVerExist = true;
                                                            }
                                                            if (typeof respJSON.install == "object") {
                                                                checks.installExist = true;
                                                                if (typeof respJSON.install.package != "undefined" || typeof respJSON.install.package == "string") checks.install_packageExist = true;
                                                            }
                    
                                                            //// $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                                            ////     if (typeof file == "string") {
                                                            ////         var pmData = undefined;
                                                            ////         try {
                                                            ////             pmData = JSON.parse(file)
                                                            ////         } catch(e) {
                                                            ////             $log.red('py93compile: compiler error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager would be not loaded.\nMore info in the JavaScript console.')
                                                            ////             console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                                                            ////         }
                                                            ////         if (pmData != undefined) {
                                                            ////             var found = false;
                                                            ////             pmData.installed.forEach((package) => {
                                                            ////                 if (package.meta.title == respJSON.meta.title) {
                                                            ////                     found = true;
                                                            ////                 }
                                                            ////             })
                                                            ////             if (!found) {
                                                            ////                 install()
                                                            ////             } else {
                                                            ////                 if (reAdd) {
                                                            ////                     pmData.installed = pmData.installed.filter((package, index) => {
                                                            ////                         if (package.meta.title == respJSON.meta.title) {
                                                            ////                             $log(`Removed package "${package.meta.title}", index ${index}`)
                                                            ////                             return false;
                                                            ////                         } else {
                                                            ////                             return true;
                                                            ////                         }
                                                            ////                     })
                                                            ////                     $db.set('Py93/pm/data.json', JSON.stringify(pmData))
                                                            ////                     //console.log(pmData)
                                                            ////                     setTimeout(install, 200)
                                                            ////                 } else {
                                                            ////                     $log.red(`py93pm: error: found package with title "${respJSON.meta.title}" installed.\nUse --readd or -r to overwrite installations of package "${respJSON.meta.title}".`)
                                                            ////                 }
                                                            ////             }
                                                            ////         }
                                                            ////     }
                                                            //// })
                    
                                                            // var install = function() {
                                                            //console.log(pmData)
                                                            if (Object.values(checks).every(Boolean)) {
                                                                if (respJSON.meta.compVer > oldCompVer) {
                                                                    $log(`Package "${respJSON.meta.title}"\n===========================================================`);
                                                                    $log(`Title: ${respJSON.meta.title}`);
                                                                    if (typeof respJSON.meta.author != "undefined") $log(`Author: ${respJSON.meta.author}`);
                                                                    $log(`Version: ${(typeof respJSON.meta.dispVer != "undefined") ? respJSON.meta.dispVer : respJSON.meta.compVer}`);
                                                                    if (typeof respJSON.meta.license != 'undefined') $log(`License: ${respJSON.meta.license}`);
                                                                    if (typeof respJSON.meta.packageSite != 'undefined') $log(`Package site/repository: ${respJSON.meta.packageSite}`);
                                                                    if (confirm(`You are going to upgrade package "${respJSON.meta.title}". Are you sure?`)) {
                                                                        // yay, finally we installing it!
                                                                        var pmData;
                                                                        $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                                                            if (typeof file == "object") {
                                                                                file.text().then(function(filestr) {
                                                                                    try {
                                                                                        pmData = JSON.parse(filestr);
                                                                                    } catch(e) {
                                                                                        $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                                        console.error(new Error(e.stack));
                                                                                    }
                                                                                    if (typeof pmData != "undefined") {
                                                                                        pmData.installed = pmData.installed.filter((package, index) => {
                                                                                            if (package.meta.title == args[2]) {
                                                                                                $log(`Removed package "${package.meta.title}", index ${index}`);
                                                                                                return false;
                                                                                            } else {
                                                                                                return true;
                                                                                            }
                                                                                        });
                                                                                        pmData.installed.push(respJSON);
                                                                                        $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                                                    }
                                                                                });
                                                                            } else if (typeof file == "string") {
                                                                                try {
                                                                                    pmData = JSON.parse(file);
                                                                                } catch(e) {
                                                                                    $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                                    console.error(new Error(e.stack));
                                                                                }
                                                                                if (typeof pmData != "undefined") {
                                                                                    pmData.installed = pmData.installed.filter((package, index) => {
                                                                                        if (package.meta.title == args[2]) {
                                                                                            $log(`Removed package "${package.meta.title}", index ${index}`);
                                                                                            return false;
                                                                                        } else {
                                                                                            return true;
                                                                                        }
                                                                                    });
                                                                                    pmData.installed.push(respJSON);
                                                                                    $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                } else if (respJSON.meta.compVer == oldCompVer) {
                                                                    $log(`Package "${respJSON.meta.title}" is up to date. (comparsion versions in old package and package recieved from server are same)`);
                                                                } else {
                                                                    $log.red(`py93pm: upgrade error: comparsion versions (compvers) in old package and package recieved from server are not same and compver from package recieved from server is not greater than compver from old package`);
                                                                }
                                                            } else {
                                                                //$log(checks)
                                                                //$log(checksNum)
                                                                $log.red('py93pm: error: not all checks of JSON package file were successful.\nLook for more info in the JavaScript console.');
                                                                console.error(new Error('Not all checks of JSON package file were successful.'));
                                                                if (checks.versionExist != true) console.log(new Error('Check "versionExist" was not successful.'));
                                                                if (checks.versionIsNum != true) console.log(new Error('Check "versionIsNum" was not successful.'));
                                                                if (checks.versionSupp != true) console.log(new Error('Check "versionSupp" was not successful.'));
                                                                if (checks.metaExist != true) console.log(new Error('Check "metaExist" was not successful.'));
                                                                if (checks.meta_titleExist != true) console.log(new Error('Check "meta_titleExist" was not successful.'));
                                                                if (checks.meta_compVerExist != true) console.log(new Error('Check "meta_compVerExist" was not successful.'));
                                                                if (checks.installExist != true) console.log(new Error('Check "installExist" was not successful.'));
                                                                if (checks.install_packageExist != true) console.log(new Error('Check "install_packageExist" was not successful.'));
                                                            }
                                                            // }
                                                        } else {
                                                            new Error("respJSON is not object");
                                                        }
                                                    }
                                                } else {
                                                    $log.red(`py93pm: error: response header "Content-Type" value should start with "application/json", but "Content-Type" value is ${xhr.getResponseHeader('Content-Type')}`);
                                                }
                                            } else {
                                                $log.red(`py93pm: HTTP error: ${xhr.status} ${xhr.statusText}`);
                                            }
                                        };
                                        xhr.send();
                                        $log('Sended the request, now awaiting response. This can take up to 30 seconds.');
                                    } else {
                                        $log.red(`py93pm: upgrade error: package "${args[2]}" can't be upgraded using upgrade: not found "self" of package "${args[2]}"`);
                                    }
                                } else {
                                    $log.red(`py93pm: error: package "${args[2]}" not found`);
                                }
                            }
                        } else if (typeof file == "object") {
                            file.text().then(function(filestr) {
                                var pmDataJSON = null;
                                try {
                                    pmDataJSON = JSON.parse(filestr);
                                } catch(e) {
                                    $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                    console.error(new Error(e.stack));
                                }
                                if (pmDataJSON != null) {
                                    $log(`Searching for package "${args[2]}"...`);
                                    var found = false;
                                    pmDataJSON.installed.forEach((package, index) => {
                                        if (package.meta.title == args[2]) {
                                            $log(`Found package "${package.meta.title}", index ${index}`);
                                            found = true;
                                        }
                                    });
                                    if (found) {
                                        var foundSelf = false;
                                        var packageSelf = null;
                                        var oldCompVer;
                                        pmDataJSON.installed.forEach((package) => {
                                            if (package.meta.title == args[2] && !foundSelf) {
                                                oldCompVer = package.meta.compVer;
                                                if (typeof package.install.self != "undefined") {
                                                    //$log(`${package.meta.title} ${args[2]} ${package.install.self}`)
                                                    foundSelf = true;
                                                    packageSelf = package.install.self;
                                                } 
                                            }
                                        });
                                        //$log(packageSelf)
                                        //$log(foundSelf)
                                        if (foundSelf) {
                                            var xhr = new XMLHttpRequest();
                                            $log('Configuring request...');
                                            xhr.open("GET", packageSelf, true);
                                            xhr.timeout = 30000;
                                            xhr.ontimeout = function() {
                                                $log.red('py93pm: error: request timed out');
                                            };
                                            xhr.onerror = function(e) {
                                                $log.red('py93pm: request error: request failed, look for more info in the JavaScript console.');
                                                console.error(new Error(`Request failed.\n${e}`));
                                            };
                                            xhr.onload = function() {
                                                console.log(`py93pm: onload: ${xhr.status}, ${xhr.statusText}`);
                                                if (xhr.status <= 299 && xhr.status >= 200) {
                                                    if (xhr.getResponseHeader("Content-Type").startsWith('application/json')) {
                                                        var success = true;
                                                        try {
                                                            var respJSON = JSON.parse(xhr.response);
                                                        } catch (e) {
                                                            success = false;
                                                            $log.red('py93pm: JSON error: failed to parse JSON, more info in the JavaScript console');
                                                            console.error(new Error(e.stack)); // we're not throwing the error, because there will be "Uncaught" at the start of error text
                                                        }
                                                        if (success) {
                                                            /**
                                                             * This object contains 8 booleans for validating package JSON file.
                                                             * After validating, all booleans should be equal to true.
                                                             */
                                                            var checks = {
                                                                versionExist: false, // True if "version" exist
                                                                versionIsNum: false, // True if "version" is a number
                                                                versionSupp: false, // True if package JSON file syntax (defined in "version") is supported by this version
                                                                metaExist: false, // True if "meta" exist and typeof is "object"
                                                                meta_titleExist: false, // True if "title" in "meta" exist
                                                                meta_compVerExist: false, // True if "compVer" in "meta" exist
                                                                installExist: false, // True if "install" exist and typeof is "object"
                                                                install_packageExist: false // True if "package" in "install" exist and typeof is "string"
                                                            };
                                                            // Validating JSON
                                                            if (typeof respJSON == "object") { // just double-checked to make absolutely sure, this if statement may be removed in future
                                                                if (typeof respJSON.version != "undefined") checks.versionExist = true;
                                                                if (typeof respJSON.version == "number") checks.versionIsNum = true;
                                                                if ($py93.pm.supportedVers.includes(respJSON.version)) checks.versionSupp = true;
                                                                if (typeof respJSON.meta != "undefined" && typeof respJSON.meta == "object") {
                                                                    checks.metaExist = true;
                                                                    if (typeof respJSON.meta.title != "undefined") checks.meta_titleExist = true;
                                                                    if (typeof respJSON.meta.compVer != "undefined") checks.meta_compVerExist = true;
                                                                }
                                                                if (typeof respJSON.install == "object") {
                                                                    checks.installExist = true;
                                                                    if (typeof respJSON.install.package != "undefined" || typeof respJSON.install.package == "string") checks.install_packageExist = true;
                                                                }
                        
                                                                //// $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                                                ////     if (typeof file == "string") {
                                                                ////         var pmData = undefined;
                                                                ////         try {
                                                                ////             pmData = JSON.parse(file)
                                                                ////         } catch(e) {
                                                                ////             $log.red('py93compile: compiler error: failed to parse data.json in /a/Py93/pm/. Packages installed via package manager would be not loaded.\nMore info in the JavaScript console.')
                                                                ////             console.error(new Error(`Failed to parse data.json.\n${e.stack}`));
                                                                ////         }
                                                                ////         if (pmData != undefined) {
                                                                ////             var found = false;
                                                                ////             pmData.installed.forEach((package) => {
                                                                ////                 if (package.meta.title == respJSON.meta.title) {
                                                                ////                     found = true;
                                                                ////                 }
                                                                ////             })
                                                                ////             if (!found) {
                                                                ////                 install()
                                                                ////             } else {
                                                                ////                 if (reAdd) {
                                                                ////                     pmData.installed = pmData.installed.filter((package, index) => {
                                                                ////                         if (package.meta.title == respJSON.meta.title) {
                                                                ////                             $log(`Removed package "${package.meta.title}", index ${index}`)
                                                                ////                             return false;
                                                                ////                         } else {
                                                                ////                             return true;
                                                                ////                         }
                                                                ////                     })
                                                                ////                     $db.set('Py93/pm/data.json', JSON.stringify(pmData))
                                                                ////                     //console.log(pmData)
                                                                ////                     setTimeout(install, 200)
                                                                ////                 } else {
                                                                ////                     $log.red(`py93pm: error: found package with title "${respJSON.meta.title}" installed.\nUse --readd or -r to overwrite installations of package "${respJSON.meta.title}".`)
                                                                ////                 }
                                                                ////             }
                                                                ////         }
                                                                ////     }
                                                                //// })
                        
                                                                // var install = function() {
                                                                //console.log(pmData)
                                                                if (Object.values(checks).every(Boolean)) {
                                                                    if (respJSON.meta.compVer > oldCompVer) {
                                                                        $log(`Package "${respJSON.meta.title}"\n===========================================================`);
                                                                        $log(`Title: ${respJSON.meta.title}`);
                                                                        if (typeof respJSON.meta.author != "undefined") $log(`Author: ${respJSON.meta.author}`);
                                                                        $log(`Version: ${(typeof respJSON.meta.dispVer != "undefined") ? respJSON.meta.dispVer : respJSON.meta.compVer}`);
                                                                        if (typeof respJSON.meta.license != 'undefined') $log(`License: ${respJSON.meta.license}`);
                                                                        if (typeof respJSON.meta.packageSite != 'undefined') $log(`Package site/repository: ${respJSON.meta.packageSite}`);
                                                                        if (confirm(`You are going to upgrade package "${respJSON.meta.title}". Are you sure?`)) {
                                                                            // yay, finally we installing it!
                                                                            var pmData;
                                                                            $db.getRaw('Py93/pm/data.json', function(_a, file) {
                                                                                if (typeof file == "object") {
                                                                                    file.text().then(function(filestr) {
                                                                                        try {
                                                                                            pmData = JSON.parse(filestr);
                                                                                        } catch(e) {
                                                                                            $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                                            console.error(new Error(e.stack));
                                                                                        }
                                                                                        if (typeof pmData != "undefined") {
                                                                                            pmData.installed = pmData.installed.filter((package, index) => {
                                                                                                if (package.meta.title == args[2]) {
                                                                                                    $log(`Removed package "${package.meta.title}", index ${index}`);
                                                                                                    return false;
                                                                                                } else {
                                                                                                    return true;
                                                                                                }
                                                                                            });
                                                                                            pmData.installed.push(respJSON);
                                                                                            $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                                                        }
                                                                                    });
                                                                                } else if (typeof file == "string") {
                                                                                    try {
                                                                                        pmData = JSON.parse(file);
                                                                                    } catch(e) {
                                                                                        $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                                                                        console.error(new Error(e.stack));
                                                                                    }
                                                                                    if (typeof pmData != "undefined") {
                                                                                        pmData.installed = pmData.installed.filter((package, index) => {
                                                                                            if (package.meta.title == args[2]) {
                                                                                                $log(`Removed package "${package.meta.title}", index ${index}`);
                                                                                                return false;
                                                                                            } else {
                                                                                                return true;
                                                                                            }
                                                                                        });
                                                                                        pmData.installed.push(respJSON);
                                                                                        $db.set('Py93/pm/data.json', JSON.stringify(pmData));
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    } else if (respJSON.meta.compVer == oldCompVer) {
                                                                        $log(`Package "${respJSON.meta.title}" is up to date. (comparsion versions in old package and package recieved from server are same)`);
                                                                    } else {
                                                                        $log.red(`py93pm: upgrade error: comparsion versions (compvers) in old package and package recieved from server are not same and compver from package recieved from server is not greater than compver from old package`);
                                                                    }
                                                                } else {
                                                                    // $log(checks)
                                                                    //$log(checksNum)
                                                                    $log.red('py93pm: error: not all checks of JSON package file were successful.\nLook for more info in the JavaScript console.');
                                                                    console.error(new Error('Not all checks of JSON package file were successful.'));
                                                                    if (checks.versionExist != true) console.log(new Error('Check "versionExist" was not successful.'));
                                                                    if (checks.versionIsNum != true) console.log(new Error('Check "versionIsNum" was not successful.'));
                                                                    if (checks.versionSupp != true) console.log(new Error('Check "versionSupp" was not successful.'));
                                                                    if (checks.metaExist != true) console.log(new Error('Check "metaExist" was not successful.'));
                                                                    if (checks.meta_titleExist != true) console.log(new Error('Check "meta_titleExist" was not successful.'));
                                                                    if (checks.meta_compVerExist != true) console.log(new Error('Check "meta_compVerExist" was not successful.'));
                                                                    if (checks.installExist != true) console.log(new Error('Check "installExist" was not successful.'));
                                                                    if (checks.install_packageExist != true) console.log(new Error('Check "install_packageExist" was not successful.'));
                                                                }
                                                                // }
                                                            } else {
                                                                new Error("respJSON is not object");
                                                            }
                                                        }
                                                    } else {
                                                        $log.red(`py93pm: error: response header "Content-Type" value should start with "application/json", but "Content-Type" value is ${xhr.getResponseHeader('Content-Type')}`);
                                                    }
                                                } else {
                                                    $log.red(`py93pm: HTTP error: ${xhr.status} ${xhr.statusText}`);
                                                }
                                            };
                                            xhr.send();
                                            $log('Sended the request, now awaiting response. This can take up to 30 seconds.');
                                        } else {
                                            $log.red(`py93pm: upgrade error: package "${args[2]}" can't be upgraded using upgrade: not found "self" of package "${args[2]}"`);
                                        }
                                    } else {
                                        $log.red(`py93pm: error: package "${args[2]}" not found`);
                                    }
                                }
                            });
                        }
                    });
                } else if (args[1] == "info" || args[1] == "i") {
                    $db.getRaw('Py93/pm/data.json', function(_a, file) {
                        if (typeof file == "string") {
                            var pmDataJSON = null;
                            try {
                                pmDataJSON = JSON.parse(file);
                            } catch(e) {
                                $log.red(`py93pm: JSON error: failed to parse data.json in /a/Py93/pm/\nError details:\n${e.stack}`);
                                console.error(new Error(e.stack));
                            }
                            if (pmDataJSON != null) {
                                $log(`Searching for package "${args[2]}"...`);
                                var found = false;
                                pmDataJSON.installed.forEach((package, index) => {
                                    if (package.meta.title == args[2]) {
                                        $log(`Found package "${package.meta.title}", index ${index}`);
                                        found = true;
                                    }
                                });
                                if (found) {
                                    pmDataJSON.installed.forEach((package, index) => {
                                        if (package.meta.title == args[2]) {
                                            $log(`\nPackage "${package.meta.title}"\n===========================================================`);
                                            $log(`Index: ${index}`);
                                            $log(`Title: ${package.meta.title}`);
                                            if (typeof package.meta.author != "undefined") $log(`Author: ${package.meta.author}`);
                                            $log(`Version: ${(typeof package.meta.dispVer != "undefined") ? package.meta.dispVer : package.meta.compVer}`);
                                            if (typeof package.meta.license != 'undefined') $log(`License: ${package.meta.license}`);
                                            if (typeof package.meta.packageSite != 'undefined') $log(`Package site/repository: ${package.meta.packageSite}`);
                                            $log(`Can be upgraded using upgrade: ${(typeof package.install.self != "undefined") ? 'yes' : 'no'}`);
                                        }
                                    });
                                } else {
                                    $log.red(`py93pm: error: package "${args[2]}" not found`);
                                }
                            }
                        }
                    });
                } else {
                    $log(help);
                }
            }
        } else {
            $log($py93.help);
        }
    },
    hascli: true,
    terminal: true
};
console.log('[Py93Helper] Finished execution.');
