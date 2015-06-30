package com.kurisubrooks.eew.java.xml;

public class Item {

    private String date;
    private String epicenter;
    private String magnitude;
    private String seismic;
    private String testMode;
    private String latitude;
    private String longitude;
    private String depth;
    private String id;

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public String getEpicenter() {
        return epicenter;
    }
    public void setEpicenter(String epicenter) {
        this.epicenter = epicenter;
    }

    public String getMagnitude() {
        return magnitude;
    }
    public void setMagnitude(String magnitude) {
        this.magnitude = magnitude;
    }

    public String getSeismic() {
        return seismic;
    }
    public void setSeismic(String seismic) {
        this.seismic = seismic;
    }

    public String getTestMode() {
        return testMode;
    }
    public void setTestMode(String testMode) {
        this.testMode = testMode;
    }

    public String getLatitude() {
        return latitude;
    }
    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }
    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getDepth() {
        return depth;
    }
    public void setDepth(String depth) {
        this.depth = depth;
    }

    public String getID() {
        return id;
    }
    public void setID(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Item [" +
                "date=" + date + ", " +
                "epicenter=" + epicenter + ", " +
                "magnitude=" + magnitude + ", " +
                "seismic=" + seismic + ", " +
                "testMode=" + testMode + ", " +
                "latitude=" + latitude + ", " +
                "longitude=" + longitude + ", " +
                "depth=" + depth + ", " +
                "id=" + id + "]";
    }

    /* Useless JSON Formatting
    @Override
    public String toString() {
        return  "{" + "\n" +
                  " \"quake\": {" + "\n" +
                    "  \"date\": " + "\"" + date + "\"," + "\n" +
                    "  \"epicenter\": " + "\"" + epicenter + "\"," + "\n" +
                    "  \"magnitude\": " + "\"" + magnitude + "\"," + "\n" +
                    "  \"seismic\": " + "\"" + seismic + "\"," + "\n" +
                    "  \"test_mode\": " + "\"" + testMode + "\"," + "\n" +
                    "  \"latitude\": " + "\"" + latitude + "\"," + "\n" +
                    "  \"longitude\": " + "\"" + longitude + "\"," + "\n" +
                    "  \"depth\": " + "\"" + depth + "\"," + "\n" +
                    "  \"id\": " + "\"" + id + "\"" + "\n" +
                  " }" + "\n" +
                "}";
    }
    */
}