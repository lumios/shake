// Load library
var $ = require('browserify-zepto'); //require('nw.gui').Window.get().showDevTools()
function setLanguage() {
    if ($("input[name='lang']:checked").val() == "en") {
        $(".en").show()
        $(".jp").hide()
    } else {
        $(".jp").show()
        $(".en").hide()
    }
}
$("input[name='lang']").change(setLanguage)
setLanguage()
