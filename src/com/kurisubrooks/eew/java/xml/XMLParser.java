package com.kurisubrooks.eew.java.xml;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.EndElement;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;

public class XMLParser {
	static final String QUAKE = "quake";
	static final String DATE = "eq_date";
	static final String EPICENTER = "epicenter_code";
	static final String MAGNITUDE = "magnitude";
	static final String SEISMIC = "seismic_scale";
	static final String TESTMODE = "training_type";
	static final String LATITUDE = "epicenter_lat";
	static final String LONGITUDE = "epicenter_lng";
	static final String DEPTH = "depth";
	static final String ID = "quake_id";

	public List<Quake> readConfig(InputStream stream) {
		List<Quake> items = new ArrayList<Quake>();
		try {
			// First, create a new XMLInputFactory
			XMLInputFactory inputFactory = XMLInputFactory.newInstance();

			// Setup a new eventReader
			InputStream in = stream;
			XMLEventReader eventReader = inputFactory.createXMLEventReader(in);

			// read the XML document
			Quake item = null;

			while (eventReader.hasNext()) {
				XMLEvent event = eventReader.nextEvent();

				if (event.isStartElement()) {
					StartElement startElement = event.asStartElement();

					// If we have an item element, we create a new item
					if (startElement.getName().getLocalPart() == (QUAKE)) {
						item = new Quake();
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(DATE)) {
						event = eventReader.nextEvent();
						item.setDate(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(EPICENTER)) {
						event = eventReader.nextEvent();
						item.setEpicenter(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(MAGNITUDE)) {
						event = eventReader.nextEvent();
						item.setMagnitude(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(SEISMIC)) {
						event = eventReader.nextEvent();
						item.setSeismic(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(TESTMODE)) {
						event = eventReader.nextEvent();
						item.setTestMode(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(LATITUDE)) {
						event = eventReader.nextEvent();
						item.setLatitude(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(LONGITUDE)) {
						event = eventReader.nextEvent();
						item.setLongitude(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(DEPTH)) {
						event = eventReader.nextEvent();
						item.setDepth(event.asCharacters().getData());
						continue;
					}

					if (event.asStartElement().getName().getLocalPart()
							.equals(ID)) {
						event = eventReader.nextEvent();
						item.setID(event.asCharacters().getData());
						continue;
					}
				}
				// If we reach the end of an item element, we add it to the list
				if (event.isEndElement()) {
					EndElement endElement = event.asEndElement();
					if (endElement.getName().getLocalPart() == (QUAKE)) {
						items.add(item);
					}
				}

			}
		} catch (XMLStreamException e) {
			e.printStackTrace();
		}
		return items;
	}

}