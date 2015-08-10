- Create Twitter Bot (Read @eewbot)

- Create Twitter Bot CSV decoder
```
data url: https://twitter.com/eewbot

String: 37,00,2015/08/10 11:35:01,0,1,ND20150810113456,2015/08/10 11:34:44,38.9,141.6,宮城県北部,80,4.3,3,0,0

Format:
37, 					(1 - Type of Message)
00, 					(2 - Training Mode?)
2015/08/10 11:35:01, 	(3 - Announcement Time)
0, 						(4 - Announcement Situation)
1, 						(5 - Telegram Number)
ND20150810113456, 		(6 - Earthquake ID)
2015/08/10 11:34:44, 	(7 - Earthquake Occurrence Time)
38.9, 					(8 - Latitude)
141.6, 					(9 - Longitude)
宮城県北部,			  (10 - Epicenter Place Name)
80, 					(11 - Depth)
4.3, 					(12 - Magnitude)
3, 						(13 - Maximum Seismic Intensity)
0, 						(14 - Land/Sea)
0 						(15 - Alarm)

----------------

1:
	35 = Seismic Intensity, no magnitude,
	36/37 = Seismic Intensity, Estimated magnitude,
	37 = False Alarm
2:
	0 = Normal,
	1 = Training mode (False alarm)
3 = Announcement time
4:
	0 = Normal,
	7 = More Details coming,
	8/9 = Final Report
5 = earthquake update ID
6 = earthquake ID
7 = earthquake Occurrence time
8 = latitude
9 = longitude
10  = epicenter place name
11 = depth (km)
12 = magnitude (M)
13 = seismic intensity (震度)
14:
	0 = On Land,
	1 = In the Ocean
15:
	0 = No public alarm,
	1 = Public alarm (eew published via tv)
```

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
