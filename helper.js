// This script should be loaded at boot.
// Put it in /a/boot/
console.log('[Py93Helper] Started execution');
le._apps.py93 = {
    exec: function() {
        var args = this.arg.arguments;
        if (args[0] == "shell" || args[0] == "s") {
            $fs.utils.getMenuOpenWith('/a/Py93/brython/console.html')[0].action();
        } else if (args[0] == "help" || args[0] == "h") {
            $log('Py93 Menu: usage:\nh, help - print this help message\ns, shell - launch Py93 shell')
        } else {
            $log('Py93 Menu: usage:\nh, help - print this help message\ns, shell - launch Py93 shell')
        }
    },
    hascli: true,
    terminal: true
};
console.log('[Py93Helper] Finished execution.');