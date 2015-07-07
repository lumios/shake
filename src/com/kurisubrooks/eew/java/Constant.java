package com.kurisubrooks.eew.java;

import java.util.ArrayList;

import com.kurisubrooks.eew.java.xml.Quake;

public class Constant {
	private static ArrayList<Quake> rQ = new ArrayList<Quake>();
	
	public static boolean compareQuakes(ArrayList<Quake> qs) {
		
		if (rQ.isEmpty()) {
			System.out.println("Recent Earthquakes list is Empty - Building List");
			rQ = qs;
			return false;
		}
		
		if (checkForNewItem(qs, rQ)) {
			System.out.println("Quake list updated! Triggering event.");
			try {
				EEWListener.newQuake(qs.get(0));
				rQ = qs;
				return true;
			} catch (Exception e) {
				e.printStackTrace();
				return false;
			}
		}
		return false;
	}
	
	private static boolean checkForNewItem(ArrayList<Quake> aU, ArrayList<Quake> aB) {
		ArrayList<Quake> aN = aU;
		aN.removeAll(aB);
		if (aN.isEmpty()) {
			return false;
		} else {
			return true;
		}
	}
	
	public static ArrayList<Quake> getRecentQuakes() {
		return rQ;
	}
}
 