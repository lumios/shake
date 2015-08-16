## Program
- Run in Daemon
- Run on Startup

#### Installation
- Installing Files
    - [MAC] Move Sound Files to `~/Library/Sounds`
- Choose Settings
    - Save to file

#### Connectivity
- Internet Drops out, deliver Silent Notification, retry every 10 seconds

#### Settings
- Language (en/jp)
- Location
- Alert Size (Magnitude, Seismic)
- Night Mode (Silent after 12am, unless above M6)

## Notifications
#### Sounds
- ~Alert Audio~
    - ~Update #1~      'nhk-alert'
    - ~Update #2+~     'nhk'
- ~If Earthquake greater than Seismic 5-~
    - ~Play~           'keitai'

#### Alerts
- ~Format~
    - ~Title~     : ~"Earthquake Early Warning"~
    - ~Subtitle~  : ~"Please be alert to strong shaking."~
    - ~Message~   : ~"Magnitude, Max Seismic, Tsunami"~
- If greater than Magnitude 6.5, Seismic 6+
    - Ignore Location, Publish to all clients

## Parsing
- Epicenter Kanji
```
付近 - Near
地方 - Region/Area
沖   - Off the Coast
県   - Prefecture
支庁 - Subprefecture

北部 - North
中部 - Middle / Central
南部 - South
東部 - East
西部 - West

湾 - Bay
灘 - Beach
島 - Island
洋 - Ocean
海 - Sea
海峡 - Strait
内陸 - Inland

```

- ~Data~
```
type,training_mode,announce_time,situation,revision,earthquake_id,earthquake_time,latitude,longitude,epicenter,depth,magnitude,semismic,geography,alarm
37,00,2015/08/10 11:35:01,0,1,ND20150810113456,2015/08/10 11:34:44,38.9,141.6,宮城県北部,80,4.3,3,0,0
```

```
"type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "semismic", "geography", "alarm"

37,                     (35 = Seismic, 36/37 = Seismic & Magnitude, 39 = False Alarm)
00,                     (0 = Normal, 1 = Test Mode)
2015/08/10 11:35:01,    (Announcement Time)
0,                      (0 = Normal, 7 = Details Pending, 8/9 = Final Report)
1,                      (Earthquake Data Update ID)
ND20150810113456,       (Earthquake ID)
2015/08/10 11:34:44,    (Earthquake Occurrence Time)
38.9,                   (Latitude)
141.6,                  (Longitude)
宮城県北部,              (Epicenter Place Name)
80,                     (Depth
4.3,                    (Magnitude)
3,                      (Maximum Seismic Intensity)
0,                      (0 = On Land, 1 = In the Sea)
0                       (0 = No Alarm, 1 = Public Alarm)
```
