<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=9" />
		
		<title>NWIS Reporting Application for Time Series</title>

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
		<jsp:include page="/WEB-INF/jsp/constants.jsp"></jsp:include>	
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/util/template.js"></script>
		<script type="text/javascript" src="js/util/local_storage.js"></script>
		<script type="text/javascript" src="js/util/ui.js"></script>
		<script type="text/javascript" src="js/util/auth.js"></script>

		<%-- models --%>

		<%-- views --%>
		<script type="text/javascript" src="js/view/BaseView.js"></script>
		
		<script type="text/javascript" src="js/view/reports/BaseReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/ExtremesReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/VDiagramReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/UvHydrographReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/SiteVisitPeakReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/SensorReadingSummaryReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/CorrectionsAtAGlanceReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/TimeSeriesSummaryFullReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/DvHydrographReportView.js"></script>
		<script type="text/javascript" src="js/view/reports/FiveYearGWSummaryReportView.js"></script>
		
		<script type="text/javascript" src="js/view/SiteSelectorView.js"></script>
		<script type="text/javascript" src="js/view/TimeSeriesSelectionGridView.js"></script>
		<script type="text/javascript" src="js/view/ReportConfigView.js"></script>
		<script type="text/javascript" src="js/view/TimeSeriesView.js"></script>
		
		<%-- widgets --%>
		<script type="text/javascript" src="js/view/widgets/PopupView.js"></script>
		<script type="text/javascript" src="js/view/widgets/SelectField.js"></script>
		<script type="text/javascript" src="js/view/widgets/TextField.js"></script>
		<script type="text/javascript" src="js/view/widgets/Select2Field.js"></script>
		<script type="text/javascript" src="js/view/widgets/DateField.js"></script>

		<%-- controllers --%>
		<script type="text/javascript" src="js/controller/AqcuRouter.js"></script>

		<%-- Init point for app --%>
		<script type="text/javascript" src="js/init.js"></script>
		<script type="text/javascript">$(document).ready(AQCU.initialize);</script>
		
		<%-- JIRA collector --%>
		<jsp:include page="/WEB-INF/jsp/jiracollection.jsp"></jsp:include>

		<%-- Google Analytics --%>
		<jsp:include page="/WEB-INF/jsp/analytics.jsp"></jsp:include>
		
	</head>
	<body>
		<%-- USGS VisID compliant header --%>
		<jsp:include page="jsp/header.jsp"></jsp:include>
		
		<div id="aqcu-ui-content">
			<%-- main container div, will be used by JS rendering code as target --%>
		</div>
		
		<div class="sub-banner">
			<div class="sub-banner-title">NWIS Reporting Application for Time Series</div>
			<div class="upper-right-corner">
				<a onclick="AQCU.util.auth.logout()">NWIS-RA Home</a>
			</div>
		</div>
		
		<%-- USGS VisID compliant footer --%>
		<jsp:include page="jsp/footer.jsp"></jsp:include>
	</body>
</html>
