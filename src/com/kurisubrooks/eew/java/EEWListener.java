package com.kurisubrooks.eew.java;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import notify.Notify;

import com.kurisubrooks.eew.java.xml.*;

public class EEWListener {
	String api = "http://api.quake.twiple.jp/quake/index.xml";
    String alert = "../resources/alert.mp3";
    
    public EEWListener() throws MalformedURLException {
    	
    	final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    	
    	final URL ApiURL = new URL(api);
    	
    	Runnable listener = new Runnable() {
			@Override
			public void run() {
				System.out.println("BEGIN UPDATE");
				try {
					URLConnection eq = ApiURL.openConnection();
					XMLParser parser = new XMLParser();
					
					List<Quake> receivedXML = parser.readConfig(eq.getInputStream());
					
					Constant.compareQuakes((ArrayList<Quake>) receivedXML);
					
					System.out.println("Got quakes data.");
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
    	};
    	scheduler.scheduleWithFixedDelay(listener, 2, 2, TimeUnit.SECONDS);
    }
    
    public static void newQuake(Quake nQ) throws Exception {
    	Notify n = notify.Notify.getInstance();
    	//System.out.println("Earthquake Magnitude " + Integer.valueOf(nQ.getMagnitude()) / 10 +  "Epicenter: " + nQ.getEpicenter() + ", Depth: " + nQ.getDepth() + ", Scale: " + nQ.getSeismic());
    	n.notify(notify.MessageType.INFO, "Earthquake Magnitude " + Integer.valueOf(nQ.getMagnitude()) / 10, "Epicenter: " + nQ.getEpicenter() + ", Depth: " + nQ.getDepth() + ", Scale: " + nQ.getSeismic());
    }
}
