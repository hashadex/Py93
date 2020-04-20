// Py93 0.1 pre-release iframe installer
var instwin = $window({
    url: "install.html",
    title: "Py93 v.0.1pr Installer."
})
var createMobj /* Message object */ = function(type, message) {
    if (type == 'conn') {
        let key = Math.round((new Date()).getTime / 1000)
        let mobj = {}
        mobj.type = "conn"
        mobj.data = {}
        mobj.data.key = key
        return mobj
    }
}
instwin.postMessage(createMobj('conn'))
var connEst = false
instwin.onmessage = function() {
    connEst = true
}
if (connEst !== true) {
    var timer = setTimeout(function() {
        
    })
}