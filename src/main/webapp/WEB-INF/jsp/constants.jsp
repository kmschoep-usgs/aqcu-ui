<%@page import="gov.usgs.aqcu.util.AqcuConfigurationLoaderSingleton"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<script  type="text/javascript">
	if (!window.AQCU) {
		window.AQCU = {}; //top level namespace
	}

	AQCU.constants = {
		nwisRaHome: '<%=AqcuConfigurationLoaderSingleton.getProperty("nwis-ra.home")%>',
		serviceEndpoint: '<%=AqcuConfigurationLoaderSingleton.getProperty("aqcu.reports.webservice")%>',
                feedbackEmail: '<%=AqcuConfigurationLoaderSingleton.getProperty("nwis/feedbackEmail")%>',
                helpEmail: '<%=AqcuConfigurationLoaderSingleton.getProperty("nwis/helpEmail")%>'
	};
</script>
