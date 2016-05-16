AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "EX",
	reportType: "extremes",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points'
		},{
			requestId: "derivedTimeseriesIdentifier",
			display: "Daily Value",
			direction: "downchain",
			defaultComputation: "Mean", //note this parameter is used to load a default since we aren't specifying a computation filter
			publish: 'true',
			period: 'Daily'
		}]
});