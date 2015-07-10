var EEW = function() {
    /* source; this must be xml format */
    this.source = "http://api.quake.twiple.jp/quake/index.xml";
    
    /* epicnter code source; this must be same domain */
    this.epicenterCodeSource = "./epicenter-code.dat";
    
    /* alarm */
    this.alarmSource = "./sound.mp3";
    
    /* updating timer */
    this.updateTimer;
    
    /* audio context */
    this.audio;
    
    /* updating interval time (ms) */
    this.updateInterval = 5000;
    
    /* term of showing warning (ms) */
    this.warningTerm = 3 * 60;
    
    /* UI */
    this.alarmHeight = 290;
    this.alarmMargin = 50;
    
    /* last checked quake ID */
    this.lastId;
    
    /* epicenter codes */
    this.epicenterCodes = null;
    
    /* warned quake IDs */
    this.warnedIds = [];
    
    /* alarming scale as code */
    this.alarmScale = '5-';
    
    /* Seismic Intensity table (Shindo) */
    this.scaleCodeTable = {
        '01': { level: 1, ja: "Seismic Intensity 1" },
        '02': { level: 2, ja: "Seismic Intensity 2" },
        '03': { level: 3, ja: "Seismic Intensity 3" },
        '04': { level: 4, ja: "Seismic Intensity 4" },
        '5-': { level: 5, ja: "Seismic Intensity 5-" },
        '5+': { level: 6, ja: "Seismic Intensity 5+" },
        '6-': { level: 7, ja: "Seismic Intensity 6-" },
        '6+': { level: 8, ja: "Seismic Intensity 6+" },
        '07': { level: 9, ja: "Seismic Intensity 7" }
    };
    
    /* Prefectures */
    this.areas = [
        { code: 'JP-01', ja: 'Hokkaido', lat: 43.063968, lng: 141.347899 },
        { code: 'JP-02', ja: 'Aomori',   lat: 40.824623, lng: 140.740593 },
        { code: 'JP-03', ja: 'Iwate',   lat: 39.703531, lng: 141.152667 },
        { code: 'JP-04', ja: 'Miyagi',   lat: 38.268839, lng: 140.872103 },
        { code: 'JP-05', ja: 'Akita',   lat: 39.718600, lng: 140.102334 },
        { code: 'JP-06', ja: 'Yamagata',   lat: 38.240437, lng: 140.363634 },
        { code: 'JP-07', ja: 'Fukushima',   lat: 37.750299, lng: 140.467521 },
        { code: 'JP-08', ja: 'Ibaraki',   lat: 36.341813, lng: 140.446793 },
        { code: 'JP-09', ja: 'Tochigi',   lat: 36.565725, lng: 139.883565 },
        { code: 'JP-10', ja: 'Tochigi',   lat: 36.391208, lng: 139.060156 },
        { code: 'JP-11', ja: 'Gunma',   lat: 35.857428, lng: 139.648933 },
        { code: 'JP-12', ja: 'Saitama',   lat: 35.605058, lng: 140.123308 },
        { code: 'JP-13', ja: 'Tokyo',   lat: 35.689521, lng: 139.691704 },
        { code: 'JP-14', ja: 'Kanagawa', lat: 35.447753, lng: 139.642514 },
        { code: 'JP-15', ja: 'Niigate',   lat: 37.902418, lng: 139.023221 },
        { code: 'JP-16', ja: 'Toyama',   lat: 36.695290, lng: 137.211338 },
        { code: 'JP-17', ja: 'Ishikawa',   lat: 36.594682, lng: 136.625573 },
        { code: 'JP-18', ja: 'Fukui',   lat: 36.065219, lng: 136.221642 },
        { code: 'JP-19', ja: 'Yamanashi',   lat: 35.664158, lng: 138.568449 },
        { code: 'JP-20', ja: 'Nagano',   lat: 36.651289, lng: 138.181224 },
        { code: 'JP-21', ja: 'Gifu',   lat: 35.391227, lng: 136.722291 },
        { code: 'JP-22', ja: 'Shizuoka',   lat: 34.976978, lng: 138.383054 },
        { code: 'JP-23', ja: 'Aichi',   lat: 35.180188, lng: 136.906565 },
        { code: 'JP-24', ja: 'Mie',   lat: 34.730283, lng: 136.508591 },
        { code: 'JP-25', ja: 'Shiga',   lat: 35.004531, lng: 135.868590 },
        { code: 'JP-26', ja: 'Kyoto',   lat: 35.021004, lng: 135.755608 },
        { code: 'JP-27', ja: 'Osaka',   lat: 34.686297, lng: 135.519661 },
        { code: 'JP-28', ja: 'Hyogo',   lat: 34.691279, lng: 135.183025 },
        { code: 'JP-29', ja: 'Nara',   lat: 34.685333, lng: 135.832744 },
        { code: 'JP-30', ja: 'Wakayama', lat: 34.226034, lng: 135.167506 },
        { code: 'JP-31', ja: 'Tottori',   lat: 35.503869, lng: 134.237672 },
        { code: 'JP-32', ja: 'Shimane',   lat: 35.472297, lng: 133.050499 },
        { code: 'JP-33', ja: 'Okayama',   lat: 34.661772, lng: 133.934675 },
        { code: 'JP-34', ja: 'Hiroshima',   lat: 34.396560, lng: 132.459622 },
        { code: 'JP-35', ja: 'Yamaguchi',   lat: 34.186121, lng: 131.470500 },
        { code: 'JP-36', ja: 'Tokushima',   lat: 34.065770, lng: 134.559303 },
        { code: 'JP-37', ja: 'Kagawa',   lat: 34.340149, lng: 134.043444 },
        { code: 'JP-38', ja: 'Ehime',   lat: 33.841660, lng: 132.765362 },
        { code: 'JP-39', ja: 'Kochi',   lat: 33.559705, lng: 133.531080 },
        { code: 'JP-40', ja: 'Fukuoka',   lat: 33.606785, lng: 130.418314 },
        { code: 'JP-41', ja: 'Saga',   lat: 33.249367, lng: 130.298822 },
        { code: 'JP-42', ja: 'Nagasaki',   lat: 32.744839, lng: 129.873756 },
        { code: 'JP-43', ja: 'Kumamoto',   lat: 32.789828, lng: 130.741667 },
        { code: 'JP-44', ja: 'Oita',   lat: 33.238194, lng: 131.612591 },
        { code: 'JP-45', ja: 'Miyazaki',   lat: 31.911090, lng: 131.423855 },
        { code: 'JP-46', ja: 'Kagoshima', lat: 31.560148, lng: 130.557981 },
        { code: 'JP-47', ja: 'Okinawa',   lat: 26.212401, lng: 127.680932 },
        
        // Islands
        { code: 'JP-13', ja: 'Izu', lat: 34.737492, lng: 139.400538 },
        { code: 'JP-46', ja: 'Amami Islands', lat: 28.186892, lng: 129.449791 },
        { code: 'JP-47', ja: 'Miyako',   lat: 24.825225, lng: 125.302156 },
        { code: 'JP-47', ja: 'Yaeyama',   lat: 24.343023, lng: 123.881790 },
    ];
};
 
EEW.prototype.listen = function() {
    var self = this;
    this.updateTimer = window.setInterval(this.update.bind(this), this.updateInterval);
    $.ajax({
        type: "GET",
        dataType: "text",
        url: this.epicenterCodeSource,
        success: function(text) {
            var i, elems, lines = $.trim(text).split("\n");
            self.epicenterCodes = {};
            for(i = 0; i < lines.length; i++){
                elems = $.trim(lines[i]).split(",");
                self.epicenterCodes[elems[0]] = elems[1];
            }
            self.update();
        },
        error: function(){
            console.log("Could not get epicenter codes");
        }
    });
    if(window.Audio){
        this.audioContext = new Audio(this.alarmSource);
        this.audioContext.load();
    }
};
 
EEW.prototype.stopListen = function() {
    if(this.updateTimer == null) return false;
    window.clearInterval(this.updateTimer);
    this.updateTimer = null;
    return true;
};
 
EEW.prototype.update = function() {
    var self = this;
    var query = "select * from xml where url='"+ this.source +"'";
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        callback: "callback",
        url: "https://query.yahooapis.com/v1/public/yql?format=json&q=" + 
            window.encodeURIComponent(query),
        success: function(json) {
            var stamp = new Date / 1000 | 0;
            $.each(json.query.results.quakes.quake, function() {
                if(stamp - this.eq_date > self.warningTerm) return false;
                if(self.scaleCodeTable[this.seismic_scale].level >= self.scaleCodeTable[self.alarmScale].level){
                    if(!self.in_array(this.quake_id, self.warnedIds)){
                        self.warn(this);
                        self.warnedIds.push(this.quake_id);
                    }
                }
            });
        },
        error: function() {
            console.log("Could not receive EEW warning.");
        }
    });
};
 
EEW.prototype.warn = function(data, training) {
    var i, e, epicenter, map, pos,
        areas = [], mapCodes = [];
    if(training){
        epicenter = "[Epicenter Region Name]";
        areas = ["Region 1", "Region 2", "Region 3", "Region 4"];
        mapCodes = ["JP-27"];
    }
    else{
        if(this.epicenterCodes && this.epicenterCodes[data.epicenter_code]){
            epicenter = this.epicenterCodes[data.epicenter_code];
        }
        else{
            epicenter = "Unknown Epicenter";
        }
        for(i = 0; i < this.areas.length; i++){
            e = this.areas[i];
            // Alerts the User if within 250km of Epicenter.
            if(this.getDist(data.epicenter_lat, data.epicenter_lng, e.lat, e.lng) < 250 * 1000){
                areas.push(e.ja);
                mapCodes.push(e.code);
            }
        }
    }
    map = "https://chart.googleapis.com/chart?cht=map&chs=250x280&chld=" + 
          mapCodes.join("|") + "&chco=999999|FAFF00&chf=bg,s,515792";
    i = 0;
    while(true){
        if(!$("body>.EEW-overlay[pos='"+i+"']")[0]){
            pos = i;
            break;
        }
        i++;
    }
    var bottom = pos * (this.alarmHeight + this.alarmMargin) + this.alarmMargin;
    $("body").append(
        '<div class="EEW-overlay" quake_id="'+(training ? 0 : data.quake_id)+'" '+
        '   pos="'+pos+'" style="bottom: '+bottom+'px">'+
        ' <div class="inner">'+
        '  <div class="l" style="background-image: url('+map+')"></div>'+
        '  <div class="r">'+
        '   <div class="h">Earthquake Early Warning（JMA）</div>'+
        '   <div class="d">'+
        '    <p class="msg">'+epicenter+'Please be alert to strong shaking</p>'+
        '    <p class="areas">'+areas.join('　')+'</p>'+
        '   </div>'+
        '  </div>'+
        ' </div>'+
        '</div>'
    );
    this.audioContext.pause();
    this.audioContext.currentTime = 0;
    this.audioContext.play();
    setTimeout(this.clear.bind(this, (training ? 0 : data.quake_id)), this.warningTerm * 1000);
};
 
EEW.prototype.clear = function(quake_id) {
    if(quake_id != null){
        $("body>.EEW-overlay[quake_id="+quake_id+"]").remove();
        for(var i = 0, arr = []; i < this.warnedIds.length; i++){
            if(this.warnedIds[i] != quake_id){
                arr.push(this.warnedIds[i]);
            }
        }
        this.warnedIds = arr;
    }
    else{
        $("body>.EEW-overlay").remove();
        this.warnedIds = [];
    }
};
 
EEW.prototype.getDist = function(lat1, lng1, lat2, lng2, usingConstants) {
    var Constants = {
        BESSEL: {
            a: 6377397.155,
            e2: 0.00667436061028297,
            mnum: 6334832.10663254
        },
        GRS80: {
            a: 6378137.000,
            e2: 0.00669438002301188,
            mnum: 6335439.32708317
        },
        WGS84: {
            a: 6378137.000,
            e2: 0.00669437999019758,
            mnum: 6335439.32729246
        }
    };
    if(!Constants[usingConstants || "BESSEL"]){
        return false;
    }
    var deg2rad = function(deg){ return deg * Math.PI / 180.0 };
    var C = Constants[usingConstants || "BESSEL"];
    var my = deg2rad((lat1 + lat2) / 2.0);
    var dy = deg2rad(lat1 - lat2);
    var dx = deg2rad(lng1 - lng2);
    var w = Math.sqrt(1.0 - C.e2 * Math.sin(my) * Math.sin(my));
    var m = C.mnum / (w * w * w);
    var n = C.a / w;
    var dym = dy * m;
    var dxncos = dx * n * Math.cos(my);
    return Math.sqrt(dym * dym + dxncos * dxncos);
}
 
EEW.prototype.in_array = function(key, arr) {
    var i, j;
    for(i = 0; i < arr.length; i++){
        if(arr[i] == key) return true;
    }
    return false;
};
 
 
// Start
$(function(){
    var eew = new EEW();
    eew.listen();
    
    // Training Mode
    $("#container button.training").click(function(){
        eew.warn(null, true);
    });
    
    // Tokaido Oki Earthquake
    $("#container button.toukaioki").click(function(){
        eew.warn({
            eq_date: new Date / 1000 | 0 - 10,
            epicenter_code: 499,
            magnitude: 90,
            seismic_scale: '6-',
            training_type: 0,
            epicenter_lat: 33.2,
            epicenter_lng: 136.8,
            depth: 30,
            quake_id: '000000000001'
        });
    });
    
    // Great Eastern Tohoku Earthquake
    $("#container button.higashinihon").click(function(){
        eew.warn({
            eq_date: new Date / 1000 | 0 - 10,
            epicenter_code: 287,
            magnitude: 90,
            seismic_scale: '07',
            training_type: 0,
            epicenter_lat: 38.0612,
            epicenter_lng: 142.5136,
            depth: 30,
            quake_id: '000000000002'
        });
    });
});