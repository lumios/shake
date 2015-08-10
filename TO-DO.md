- Create Twitter Bot (Read @eewbot)

- Save Settings/Remember User Settings

- Installation (First time run)

	- Moves core files into place
		- (Mac only) Move core audio notification files into `~/Library/Sounds`
	- Select Language & Location

- Only trigger event if `quake.training_type` == `0`

- Silent Mode
	- Notification Sound will not play after 12am (00:00) unless quake is above Magnitude 5 (Seismic Scale 5-)

- Run in Daemon/Background
	- Keep the program running whilst not being visibly open

- Internet connection
	- Keep running if your internet drops, don't crash the program
	- Give warning notification if program failed to get API, and try again in incremental minutes

- Advanced Notifications
	- If quake is above Magnitude 6 (or Seismic 5), post earthquake to all users, regardless of location
