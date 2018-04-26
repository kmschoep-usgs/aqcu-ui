<%@page import="gov.usgs.aqcu.util.ContextUtils"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<script  type="text/javascript">
	if (!window.AQCU) {
		window.AQCU = {}; //top level namespace
	}

	AQCU.constants = {
		nwisRaHome: '<%=ContextUtils.getProperty("java:comp/env/nwis-ra.home")%>',
		serviceEndpoint: '<%=ContextUtils.getProperty("java:comp/env/aqcu.reports.webservice")%>',
		helpEmail: '<%=ContextUtils.getProperty("java:comp/env/nwis/helpEmail")%>'
	};
</script>
