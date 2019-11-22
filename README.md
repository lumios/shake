<h1 align="center">
    <br>
    <img src="https://cloud.githubusercontent.com/assets/6291467/13650527/33b9cb46-e697-11e5-963f-af5cb9bac1f6.png">
    <br>
    Shake
    <br>
    <br>
</h1>

<p align="center">
    <br>
    <a href="https://travis-ci.org/lumios/shake"><img src="https://travis-ci.org/lumios/shake.svg?branch=master"></a>
    <a href="https://david-dm.org/lumios/shake"><img src="https://david-dm.org/lumios/shake.svg"></a>
    <br>

    An Earthquake Early Warning program for your computer.  
    あなたのコンピュータのための緊急地震速報
</p>
<h1></h1>

### Installation
##### Prerequisites
[Node.js](http://nodejs.org/) >= v4 is required. Minimum 2GB of System Memory is also recommended.  
Shake supports Mac OS X >= 10.8 and Ubuntu >= 14.04 based Linux distributions.  
Windows >= 7 is some-what supported, with no guarantee of working.

##### Download a Binary
~~Nightly beta builds are available [here](http://eew.kurisubrooks.com).  
All builds are stable to an extent, this software is still in beta.~~

Nightly Builds have been removed due to financial constraints, we'll instead be releasing new versions through [GitHub Releases](https://github.com/lumios/shake/releases) as per each Stable update. For now, please refer to the Manual Install or Build sections below.

##### Manual Install
1. `cd ~/.../shake`
2. `git clone https://github.com/lumios/shake.git`
3. `cd ~/.../shake/src`
3. `npm install`

##### Run
1. `cd ~/.../shake/src`
2. `npm start`

##### Build
1. `cd ~/.../shake`
2. `npm install`
3. `npm install gulp -g`
4. `gulp build:[platform]`

Platforms: ['mac', 'win32', 'win64', 'linux32', 'linux64', 'arm']

Running `gulp` without specifying a build-type will build for all the platforms listed above.


### Screenshots
<h1 align="center">
    <img src="https://cloud.githubusercontent.com/assets/6291467/11278149/c3090390-8f3d-11e5-8f06-422d5ec0f395.png">
    <br>
    <img src="https://cloud.githubusercontent.com/assets/6291467/11278428/053b470e-8f3f-11e5-8d76-adf8dc67a22c.png">
</h1>

### Legal

```text
Copyright (c) 2016 Lumios – All Rights Reserved.

You can use, modify, or copy this software, so long
as you don't redistribute it without explicit permission.

This software is provided "as is", without warranty of any kind.
The authors or copyright holders of this software cannot be held
liable for any claim, damages, or other liability arising from
the use of this software.

Thanks! (^o^//
```
