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
        <link rel="stylesheet" type="text/css" href="webjars/font-awesome/4.3.0/css/font-awesome.min.css" />
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
        <script type="text/javascript" src="js/util/local_storage.js"></script>
        <%-- util functions generating query parameters --%>
        <script type="text/javascript" src="js/util/ui.js"></script>
        <script type="text/javascript" src="js/util/auth.js"></script>
        <%-- util functions for the user interface --%>

        <link rel="stylesheet" type="text/css" href="webjars/select2/4.0.0/css/select2.css" />
        <script type="text/javascript" src="webjars/select2/4.0.0/js/select2.full.js"></script>
        <link rel="stylesheet" type="text/css" href="webjars/bootstrap-datepicker/1.4.0/css/bootstrap-datepicker3.css" />
        <script type="text/javascript" src="webjars/bootstrap-datepicker/1.4.0/js/bootstrap-datepicker.js"></script>
        <script type="text/javascript" src="webjars/jquery-dateFormat/1.0.2/jquery-dateFormat.js"></script>

        <%-- models --%>

        <%-- views --%>
        <script type="text/javascript" src="js/view/BaseView.js"></script>
        <script type="text/javascript" src="js/view/SiteSelectorView.js"></script>
        <script type="text/javascript" src="js/view/TimeSeriesView.js"></script>
        <script type="text/javascript" src="js/view/TimeSeriesSelectionGridView.js"></script>
        <script type="text/javascript" src="js/view/ReportConfigView.js"></script>
        
        <script type="text/javascript" src="js/view/reports/BaseReportView.js"></script>
        <script type="text/javascript" src="js/view/reports/ExtremesReportView.js"></script>
        <script type="text/javascript" src="js/view/reports/VDiagramReportView.js"></script>
        <script type="text/javascript" src="js/view/reports/UvHydrographReportView.js"></script>
        
        <%-- widgets --%>
        <script type="text/javascript" src="js/view/widgets/SelectField.js"></script>
        <script type="text/javascript" src="js/view/widgets/TextField.js"></script>
        <script type="text/javascript" src="js/view/widgets/Select2Field.js"></script>
        <script type="text/javascript" src="js/view/widgets/DateField.js"></script>

        <%-- controllers --%>
        <script type="text/javascript" src="js/controller/AqcuRouter.js"></script>
        <%-- NWIS router, all routing logic goes here. Includes session state persistence and business logic --%>

        <%-- Init point for app --%>
        <script type="text/javascript" src="js/init.js"></script>

		<script type="text/javascript">$(document).ready(AQCU.initialize);</script>
		
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
				<a onclick="AQCU.util.auth.logout()">NWIS-RA Home</a>
			</div>
		</div>
        <jsp:include page="jsp/footer.jsp"></jsp:include>
        <%-- USGS VisID compliant footer --%>
    </body>
</html>
