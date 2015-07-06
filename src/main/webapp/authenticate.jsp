<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta name="description" content="Vision login" />

        <title>NWIS-RA Time Series</title>

        <link rel="stylesheet" href="css/usgs_style_main.css" />
        <%-- some general styling for the USGS VisID compliant header/footer --%>
        <link rel="stylesheet"
              href="js/lib/bootstrap-3.0.0/dist/css/bootstrap.min.css" media="screen" />
        <%-- For responsive design column layouts --%>
        <link rel="stylesheet"
              href="js/lib/jquery/css/smoothness/jquery-ui-1.10.3.custom.min.css"
              media="screen" />
        <%-- jquery UI --%>
        <link rel="stylesheet" href="css/aqcu.css" />

        <%-- Javascript libs --%>
		<jsp:include page="/WEB-INF/jsp/constants.jsp"></jsp:include>
		<%-- Load constants for the application from JNDI into JavaScript--%>
        <script type="text/javascript" src="js/lib/jquery/js/jquery-1.9.1.js"></script>
        <%-- general utils and DOM help --%>
        <script type="text/javascript"
        src="js/lib/bootstrap-3.0.0/dist/js/bootstrap.min.js"></script>
        <%-- responsive design column layouts --%>
        <script type="text/javascript" src="js/lib/jquery/js/jquery-1.9.1.js"></script>
        <%-- duplicate import necessary, conflict with bootstrap. This second import ensures we get the JQuery version of certain functions --%>
        <script type="text/javascript"
        src="js/lib/jquery/js/jquery-ui-1.10.3.custom.js"></script>
        <script type="text/javascript" src="webjars/jquery-cookie/1.4.1-1/jquery.cookie.js"></script>
        <%-- widget/animation/UI libs --%>
        <script type="text/javascript" src="js/lib/underscore.js"></script>

		<!-- NWIS libs -->
        <script type="text/javascript" src="js/config.js"></script>
        <script type="text/javascript" src="js/util/auth.js"></script>
        
		<jsp:include page="/WEB-INF/jsp/jiracollection.jsp"></jsp:include>
		<%-- Load JIRA Collections Scripting --%>

        <%-- Google Analytics --%>
        <script type="application/javascript" src="//www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>
        <jsp:include page="/WEB-INF/jsp/analytics.jsp"></jsp:include>
        </head>

        <body>
        <jsp:include page="jsp/header.jsp"></jsp:include>
		<%-- USGS VisID compliant header --%>
		<div class="sub-banner">
			<div class="sub-banner-title">NWIS-RA Time Series</div>
		</div>
		<div class="container aqcu-authenticate-body">
			<div class="nwis-loading-indicator">&nbsp;</div> Verifying user...
        </div>
        <div id="aqcu_version_tag" class="lower-right-corner">version: 1.0?</div>
        <jsp:include page="jsp/footer.jsp"></jsp:include>
        <%-- USGS VisID compliant footer --%>

        <script type="text/javascript">
			$(document).ready(function() {
	    		AQCU.util.auth.setAuthToken('<%=request.getParameter("token")%>');
				window.location = "index.jsp";
			});
        </script>
    </body>
</html>
