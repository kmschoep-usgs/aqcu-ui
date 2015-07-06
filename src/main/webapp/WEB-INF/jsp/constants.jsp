<%@page import="javax.naming.NamingException"%>
<%@page import="javax.naming.Context"%>
<%@page import="javax.naming.InitialContext"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%!
	public String getJNDIValue(String var) {
		String result;
		try {
			Context ctx = new InitialContext();
			result =  (String) ctx.lookup("java:comp/env/" + var);
		} catch (NamingException ex) {
			result = "";
		}
		return result;
	}
%>
<script  type="text/javascript">
	if (!window.AQCU) {
		window.AQCU = {}; //top level namespace
	}

	AQCU.constants = {
		nwisRaHome: '<%=getJNDIValue("nwis-ra.home")%>',
		nwisRaServices: '<%=getJNDIValue("nwis-ra.service.url")%>',
		serviceEndpoint: '<%=getJNDIValue("aqcu.reports.front.end")%>'
	};
</script>
