// "type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "semismic", "geography", "alarm"

// MESSAGE TYPE
if (type == 35) {
    // "Max Seismic: 4"
} else if (type == 36 || 37) {
    // "Magnitude: 5, Max Seismic: 4"
} else if (type == 39) {
    // "Earthquake Warning Cancelled"
}

// TRAINING MODE
if (training_mode == 0) {
    // Push Quake
} else if (training_mode == 1) {
    // Don't push Quake
}

// SITUATION
if (situation == 0) {
    // Estimations
} else if (situation == 7) {
    // Earthquale Warning Cancelled
} else if (situation == 8 || 9) {
    // Confirmed Details
}

// UPDATE REVISION
if (revision == 1) {
    // sound = nhk-alert
} else {
    // sound = nhk
}

// MAGNITUDE
if (magnitude > 6.5) {
    // push to all clients, ignore location
}
// MAXIMUM SEISMIC INTENSITY
if (semismic > "5-") {
    //sound = keitai
}
// GEOGRAPHICAL LOCATION
if (magnitude > 5 && geography == 1) {
    // possible tsunami
}
