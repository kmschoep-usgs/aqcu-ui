AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "Extremes",
	reportType: "extremes",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points'
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			display: "Mean Daily Value",
			direction: "downchain",
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		}]
});