<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />

        <title>NWIS Reporting Application for Time Series</title>

        <link rel="stylesheet" href="css/usgs_style_main.css" />
        <%-- some general styling for the USGS VisID compliant header/footer --%>
        <link rel="stylesheet" href="js/lib/bootstrap-3.0.0/dist/css/bootstrap.min.css" media="screen" />
        <%-- For responsive design column layouts --%>
        <link rel="stylesheet" href="js/lib/jquery/css/smoothness/jquery-ui-1.10.3.custom.min.css" media="screen" />
        <%-- jquery UI --%>
        <link rel="stylesheet" href="css/aqcu.css" />
        <%-- NWIS Reporting Tool application styling --%>
        <link href="//fonts.googleapis.com/css?family=Ubuntu:400,700,400italic,700italic" rel="stylesheet" type="text/css" />
        <%-- Google Drive fonts for NWIS Reporting Application --%>

        <link rel="stylesheet" href="js/lib/bootstrap-transfer/css/bootstrap-transfer.css" type="text/css" />
        <%-- multi-select shuttle box styling --%>
        <link rel="stylesheet" type="text/css" href="webjars/font-awesome/4.0.3/css/font-awesome.min.css" />
        <%-- http://fortawesome.github.io/Font-Awesome/ via http://www.webjars.org/ --%>

		<jsp:include page="/WEB-INF/jsp/constants.jsp"></jsp:include>
		<%-- Load constants for the application from JNDI into JavaScript--%>

        <%-- Javascript libs --%>
        <script type="text/javascript" src="js/lib/jquery/js/jquery-1.9.1.js"></script>
        <%-- general utils and DOM help --%>
        <script type="text/javascript" src="js/lib/bootstrap-3.0.0/dist/js/bootstrap.min.js"></script>
        <%-- responsive design column layouts --%>
        <script type="text/javascript" src="js/lib/jquery/js/jquery-1.9.1.js"></script>
        <%-- duplicate import necessary, conflict with bootstrap. This second import ensures we get the JQuery version of certain functions --%>
        <script type="text/javascript"
        src="js/lib/jquery/js/jquery-ui-1.10.3.custom.js"></script>
        <script type="text/javascript" src="webjars/jquery-cookie/1.4.1-1/jquery.cookie.js"></script>
        <%-- widget/animation/UI libs --%>
        <script type="text/javascript" src="js/lib/underscore.js"></script>
        <%-- general util lib, dependency for backbone --%>
        <script type="text/javascript" src="js/lib/backbone.js"></script>
        <%-- model/view framework --%>
        <script type="text/javascript" src="js/lib/backbone.stickit.js"></script>
        <%-- html input to model binding extension --%>
        <script type="text/javascript" src="js/lib/handlebars-1.0.0.js"></script>
        <%-- templating library --%>

        <script type="text/javascript"
        src="js/lib/bootstrap-transfer/js/bootstrap-transfer.js"></script>
        <%-- multiselect shuttle box --%>

        <%-- Application assets --%>
        <script type="text/javascript" src="js/config.js"></script>
        <%-- namespacing and global vars --%>
        <script type="text/javascript" src="js/util/template.js"></script>
        <%-- util functions for handling templates --%>
        <script type="text/javascript" src="js/util/query.js"></script>
        <%-- util functions generating query parameters --%>
        <script type="text/javascript" src="js/util/ui.js"></script>
        <script type="text/javascript" src="js/util/auth.js"></script>
        <%-- util functions for the user interface --%>

        <%-- models --%>

        <%-- views --%>
        <script type="text/javascript" src="js/view/BaseView.js"></script>
        <script type="text/javascript" src="js/view/TimeSeriesSelectCriteriaView.js"></script>
        
        <%-- widgets --%>
        <script type="text/javascript" src="js/view/widgets/PopupView.js"></script>
        <%-- error popup view --%>
        <script type="text/javascript" src="js/view/widgets/BoxSearch.js"></script>
        <script type="text/javascript" src="js/view/widgets/NwisDateRange.js"></script>
        <script type="text/javascript" src="js/view/widgets/NwisRange.js"></script>
        <script type="text/javascript" src="js/view/widgets/MultiSelectShuttle.js"></script>
        <script type="text/javascript" src="js/view/widgets/SelectField.js"></script>
        <script type="text/javascript" src="js/view/widgets/TextField.js"></script>

        <%-- controllers --%>
        <script type="text/javascript" src="js/controller/AqcuRouter.js"></script>
        <%-- NWIS router, all routing logic goes here. Includes session state persistence and business logic --%>

        <%-- Init point for app --%>
        <script type="text/javascript" src="js/init.js"></script>

        <jsp:include page="/WEB-INF/jsp/jiracollection.jsp"></jsp:include>
		<%-- Load JIRA Collections Scripting --%>

        <%-- Google Analytics --%>
        <jsp:include page="/WEB-INF/jsp/analytics.jsp"></jsp:include>
		</head>

		<body>
        <jsp:include page="jsp/header.jsp"></jsp:include>
		<%-- USGS VisID compliant header --%>
		<div id="aqcu-ui-content">
			<%-- main container div, will be used by JS rendering code as target --%>
		</div>
		<div class="sub-banner">
			<div class="sub-banner-title">NWIS Reporting Application for Time Series</div>
			<div class="upper-right-corner">
				<a onclick="AQCU.util.auth.logout()">Logout</a>
			</div>
		</div>
		<div class="lower-right-corner">
			<div id="aqcu_version_tag">version: 1.0?</div>
		</div>
        <jsp:include page="jsp/footer.jsp"></jsp:include>
        <%-- USGS VisID compliant footer --%>
    </body>
</html>
