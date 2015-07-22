AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "Extremes",
	reportType: "extremes",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage height",
			direction: "upchain",
			parameter: "Gage height",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			display: "Mean Daily Discharge",
			direction: "downchain",
			parameter: "Discharge",
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		}]
});