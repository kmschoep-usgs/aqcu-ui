AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "Extremes",
	reportType: "extremes",
	defaultToHtml: true,
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			direction: "downchain",
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		}]
});