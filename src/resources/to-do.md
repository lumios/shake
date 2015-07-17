- ~~###[Bugs](https://gist.github.com/kurisubrooks/dd8c74a19a6b49be099f) (Updated 12:30am 16 July)~~

- Switch to a _more reliable_ [WebSocket API](https://doc01.pf.iij-engineering.co.jp/pub/sdkdoc/v1/ja_JP/websocketapi/websockif_pub_eq_receiver.html):
	- Earthquake occurred at 1:42am
	- SignalNowExpress alert at 1:45am
	- EEW (twiple api) alert at 1:46am


- Installation (First time run)
	(Design finished, please make functional, only showing one 'screen' at a time)

	- Moves core files into place
		- (Mac only ) Move core audio notification files into `~/Library/Sounds`
	- Choose language (English, Japanese)
		- After you set your language, the installation dialog will only show the options in your language and not the other one.
	- Choose area/location
		- (**Converts Area Codes to Readable format**)
	- Choose minimum magnitude(en)/seismic intensity(jp) to notify you of.
		- e.g. Minimum Magnitude of 5 (or seismic scale 5- will only notify you of earthquakes higher than Magnitude 5 (or seismic scale 5-)

- Notification Sounds
	- Use a Different Sound depending on Earthquake Intensity
		- NHK - Under Magnitude 5 (Seismic 5-)
		- REIC - Above Magnitude 5 (Seismic 5-)

- ~~Make NW.JS Faster (Maybe load the binary in the background, then open when needed?)~~

- Encorporate [Tsunami API](https://doc01.pf.iij-engineering.co.jp/pub/sdkdoc/v1/ja_JP/websocketapi/websockif_pub_tsunami_receiver.html)

- Only trigger event if `quake.training_type` = `0`

- Silent Mode
	- Notification Sound will not play after 12am (00:00) unless quake is above Magnitude 5 (Seismic Scale 5-)

- Calculate Earthquake Radius
	- Find [better formula to calculate estimated damage radius from epicenter](http://wauke.org/493) (line 242)
	- Only notify users within the affected and surrounding areas

- Cut down load time with NW.JS from 58 seconds (mac) to a maximum of 5.

- Run in Daemon/Background
	- Find a way to keep the program running whilst not being visibly open

- Internet connection
	- Give warning notification if program failed to get API, and try again every 3 minutes

- Map GUI (alert.html)
	- Opens when the event is triggered

- Localization
	- Implement a way to use different language strings from files in /localization

- Epicenter Code Translation
	- Translate `epicenter_code` to a place string (`/localization/epicenter.json`)
		e.g `quake.epicenter_code(42)` returns 'Fukuoka Prefecture'

- Advanced Notifications
	- If quake is above Magnitude 5.4 (Seismic 5+), post earthquake to all users, regardless of location
