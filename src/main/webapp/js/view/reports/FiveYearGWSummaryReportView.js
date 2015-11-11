AQCU.view.FiveYearGWSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Five Year GW Summary",
	reportType: "fiveyeargwsummary",
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondaryTimeseriesIdentifier",
			display: "Secondary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "tertiaryTimeseriesIdentifier",
			display: "Tertiary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "quaternaryTimeseriesIdentifier",
			display: "Quaternary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}]
	
});

