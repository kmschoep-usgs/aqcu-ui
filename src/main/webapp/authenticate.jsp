<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="gov.usgs.cida.auth.utils.HttpTokenUtils" %>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=9" />
		<meta name="description" content="Vision login" />

		<title>NWIS Time Series Data Reports</title>

		<%-- Libs CSS--%>
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.3.5/css/bootstrap.min.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="webjars/jquery-ui/1.11.4/jquery-ui.min.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="webjars/font-awesome/4.3.0/css/font-awesome.min.css" />
		<link rel="stylesheet" type="text/css" href="webjars/select2/4.0.0/css/select2.css" />
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap-datepicker/1.4.0/css/bootstrap-datepicker3.css" />

		<%-- AQCU CSS --%>
		<link rel="stylesheet" href="css/usgs_style_main.css" />
		<link rel="stylesheet" href="css/aqcu.css" />
		
		<%-- Libs Javascript --%>
		<script type="text/javascript" src="webjars/jquery/2.1.4/jquery.min.js"></script>
		<script type="text/javascript" src="webjars/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="webjars/jquery-ui/1.11.4/jquery-ui.min.js"></script>
		<script type="text/javascript" src="webjars/jquery-cookie/1.4.1-1/jquery.cookie.js"></script>
		<script type="text/javascript" src="webjars/underscorejs/1.8.3/underscore-min.js"></script>
		<script type="text/javascript" src="webjars/backbonejs/1.2.1/backbone-min.js"></script>
		<script type="text/javascript" src="js/lib/backbone.stickit.js"></script>
		<script type="text/javascript" src="webjars/handlebars/3.0.0-1/handlebars.min.js"></script>
		<script type="text/javascript" src="webjars/select2/4.0.0/js/select2.full.js"></script>
		<script type="text/javascript" src="webjars/bootstrap-datepicker/1.4.0/js/bootstrap-datepicker.js"></script>
		<script type="text/javascript" src="webjars/jquery-dateFormat/1.0.2/jquery-dateFormat.js"></script>

		<%-- AQCU javascript --%>
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/util/auth.js"></script>
		
		<%-- Google Analytics --%>
		<script type="application/javascript" src="//www2.usgs.gov/scripts/analytics/usgs-analytics.js"></script>
		<jsp:include page="/WEB-INF/jsp/analytics.jsp"></jsp:include>
		
	</head>	

	<body>
		<%-- USGS VisID compliant header --%>
		<jsp:include page="jsp/header.jsp"></jsp:include>
		
		<div class="sub-banner">
			<div class="sub-banner-title">NWIS Time Series Data Reports</div>
		</div>
		
		<div class="container aqcu-authenticate-body">
			<div class="aqcu-loading-indicator">&nbsp;</div> Verifying user...
		</div>
		
		<div id="aqcu_version_tag" class="lower-right-corner">version: 1.0?</div>
		
		<%-- USGS VisID compliant footer --%>
		<jsp:include page="jsp/footer.jsp"></jsp:include>

		<script type="text/javascript">
			$(document).ready(function() {
				<%
				String cleanToken = HttpTokenUtils.validateTokenFormat((String)request.getParameter("token"));
				%>
				var token = '<%=cleanToken%>';
				AQCU.util.auth.setAuthToken(token);
				window.location = "index.jsp";
			});
		</script>
	</body>
</html>
