// Load library
var gui = require('nw.gui');
require('nw.gui').Window.get().showDevTools()
// Reference to window and tray
var win = gui.Window.get();
var tray;

// Get the minimize event
win.on('minimize', function() {
		// Hide window
		this.hide();

		// Show tray
		tray = new gui.Tray({
				icon: 'icon.png'
		});

		// Show window and remove tray when clicked
		tray.on('click', function() {
				win.show();
				this.remove();
				tray = null;
		});
});
function setLanguage() {
	if ($("input[name='lang']:checked").val() == "en") {
                            $(".en").show()
							$(".jp").hide()
                        }
                        else {
							$(".jp").show()
							$(".en").hide()
                        }
}
$("input[name='lang']").change(setLanguage)
setLanguage()
