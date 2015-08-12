- [ ! ] Make CSV Parser
```
Example String: 37,00,2015/08/10 11:35:01,0,1,ND20150810113456,2015/08/10 11:34:44,38.9,141.6,宮城県北部,80,4.3,3,0,0

Format:
37,                     (1 - Type of Message)
00,                     (2 - Training Mode?)
2015/08/10 11:35:01,    (3 - Announcement Time)
0,                      (4 - Announcement Situation)
1,                      (5 - Revision Number)
ND20150810113456,       (6 - Earthquake ID)
2015/08/10 11:34:44,    (7 - Earthquake Occurrence Time)
38.9,                   (8 - Latitude)
141.6,                  (9 - Longitude)
宮城県北部,              (10 - Epicenter Place Name)
80,                     (11 - Depth)
4.3,                    (12 - Magnitude)
3,                      (13 - Maximum Seismic Intensity)
0,                      (14 - Land/Sea)
0                       (15 - Alarm)

----------------

1 = (35 = Seismic No Mag, 36/37 = Seismic with Mag, 37 = False Alarm)
2 = (0 = Normal, 1 = Test Mode)
3 = Announcement Time
4 = (0 = Normal, 7 = Details Pending, 8/9 = Final Report)
5 = Earthquake Data Update ID
6 = Earthquake ID
7 = Earthquake Occurrence time
8 = Latitude
9 = Longitude
10 = Epicenter Place Name (jp)
11 = Depth (km)
12 = Magnitude (M)
13 = Seismic Intensity (震度)
14 = (0 = On Land, 1 = In the Sea)
15 = (0 = No Alarm, 1 = Public Alarm)
```

- Settings
	- Location
	- Save Settings/Remember User Settings

- Installation (First time run)
	- Moves core files into place
		- (Mac only) Move notification sound files into `~/Library/Sounds`
	- Select Language & Location

- Silent Mode
	- Notification Sound will not play after 12am (00:00) unless quake is above Magnitude 5 (Seismic 4)

- Run in Daemon/Background
	- Keep the program running whilst not being visibly open

- Internet connection
	- Keep running if your internet drops, don't crash the program
	- Give warning notification if program failed to get API, and try again in incremental minutes

- Advanced Notifications
	- If quake is above Magnitude 7 (or Seismic 6), post earthquake to all users, regardless of location
