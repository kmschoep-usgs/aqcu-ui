package gov.usgs.aqcu.util;

import javax.naming.InitialContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A simple util class to load property values from the context
 * 
 * @author zmoore
 */
public class ContextUtils {
	private static final Logger LOG = LoggerFactory.getLogger(ContextUtils.class);

	public static String getProperty(String name) {
		try {
			return InitialContext.doLookup(name).toString();
		} catch (Exception e) {
			LOG.warn("Failed to load configuration property: \"" + name + "\". Returning null.");
			return null;
		}
	}
}