package com.kurisubrooks.eew.java;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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
				try {
					URLConnection eq = ApiURL.openConnection();
					XMLParser parser = new XMLParser();
					
					List<Item> receivedXML = parser.readConfig(eq.getInputStream());
					
					for (Item item : receivedXML) {
						System.out.println(item);
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
    	};
    	scheduler.scheduleWithFixedDelay(listener, 2, 2, TimeUnit.SECONDS);
    }
}
