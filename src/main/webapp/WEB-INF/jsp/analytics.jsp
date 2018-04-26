<%@page import="gov.usgs.aqcu.util.ContextUtils"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%-- 
TODO: Figure out if the USGS google analytics code will actually be required to this web application 
<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>
--%>
<script>
if (location.href.indexOf("localhost") >= 0) {
	ga = function(){};
} else {

	(function(i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', '//www.google-analytics.com/analytics_debug.js', 'ga');
	ga('create', '<%=ContextUtils.getProperty("java:comp/env/aqcu.google.analytics.token")%>', 'auto');
	ga('set', 'anonymizeIp', true);
	ga('send', 'pageview');
}
</script>

