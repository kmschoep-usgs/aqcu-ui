AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "Extremes", 
	reportAbbreviation: "EXT",
	reportType: "extremes",
	relatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Series",
			direction: "upchain",
			required: false,
			computation: 'Instantaneous',
			period: 'Points'
		},{
			requestId: "derivedTimeseriesIdentifier",
			display: "Daily Value",
			direction: "downchain",
			required: false,
			defaultComputation: "Mean", //note this parameter is used to load a default since we aren't specifying a computation filter
			period: 'Daily',
			autofillWithSameUnits: "true"
		}]
});