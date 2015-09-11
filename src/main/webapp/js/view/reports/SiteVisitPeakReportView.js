AQCU.view.SiteVisitPeakReportView = AQCU.view.BaseReportView.extend({
	reportName: "Site Visit Peak",
	reportType: "sitevisitpeak",
	//Gage Height may not be necessary. Find out?
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage height",
			direction: "upchain",
			parameter: "Gage height",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}],
	optionalRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Time Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}]
});


