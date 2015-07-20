- ~~Switch to a _more reliable_ [WebSocket API](https://doc01.pf.iij-engineering.co.jp/pub/sdkdoc/v1/ja_JP/websocketapi/websockif_pub_eq_receiver.html):~~

- Save Settings/Remember User Settings

- Installation (First time run)

	- Moves core files into place
		- (Mac only ) Move core audio notification files into `~/Library/Sounds`
	- Choose area/location
		- (**Converts Area Codes to Readable format**)

- Encorporate [Tsunami API](https://doc01.pf.iij-engineering.co.jp/pub/sdkdoc/v1/ja_JP/websocketapi/websockif_pub_tsunami_receiver.html)

- Only trigger event if `quake.training_type` == `0`

- Silent Mode
	- Notification Sound will not play after 12am (00:00) unless quake is above Magnitude 5 (Seismic Scale 5-)

- Calculate Earthquake Radius
	- Find [better formula to calculate estimated damage radius from epicenter](http://wauke.org/493) (line 242)
	- Only notify users within the affected and surrounding areas

- Run in Daemon/Background
	- Find a way to keep the program running whilst not being visibly open

- Internet connection
	- Keep running if your internet drops, don't crash the program
	- Give warning notification if program failed to get API, and try again in incremental minutes

- Map GUI (alert.html)
	- Opens when the event is triggered

- Epicenter Code Translation
	- Translate `epicenter_code` to a place string (`/localization/epicenter.json`)
		e.g `quake.epicenter_code(42)` returns 'Fukuoka Prefecture'

- Advanced Notifications
	- If quake is above Magnitude 7 (or Seismic 6), post earthquake to all users, regardless of location
