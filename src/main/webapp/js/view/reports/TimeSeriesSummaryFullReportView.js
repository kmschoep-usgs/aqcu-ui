AQCU.view.TimeSeriesSummaryFullReportView = AQCU.view.BaseReportView.extend({
	reportName: "Time Series Summary", 
	reportAbbreviation: "TSS",
	reportType: "timeseriessummary",
	relatedTimeseriesConfig: [{
		requestId: "upchainTimeseriesIdentifier",
		display: "Upchain Time Series",
		direction: "upchain",
		required: false,
		publish: 'true',
		computation: 'Instantaneous',
		period: 'Points'
	},{
		requestId: "derivedMeanTimeseriesIdentifier",
		display: "Daily Mean",
		direction: "downchain",
		required: false,
		publish: 'true',
		computation: 'Mean',
		period: 'Daily'
	},{
		requestId: "derivedMaxTimeseriesIdentifier",
		display: "Daily Max",
		direction: "downchain",
		required: false,
		publish: 'true',
		computation: 'Max',
		period: 'Daily'
	},{
		requestId: "derivedMinTimeseriesIdentifier",
		display: "Daily Min",
		direction: "downchain",
		required: false,
		publish: 'true',
		computation: 'Min',
		period: 'Daily'
	},{
		requestId: "derivedMedianTimeseriesIdentifier",
		display: "Daily Median",
		direction: "downchain",
		required: false,
		publish: 'true',
		computation: 'Median',
		period: 'Daily'
	}],
	ratingModels: [{ 
		requestId: "ratingModelIdentifier", 
		display: "Primary Rating Model", 
		required: false,
		bindTo: "primaryTimeseriesIdentifier"
	}]
});