AQCU.view.TimeSeriesSummaryFullReportView = AQCU.view.BaseReportView.extend({
	reportName: "Time Series Summary",
	reportType: "timeseriessummary",
	optionalRelatedTimeseriesConfig: [{
		requestId: "upchainTimeseriesIdentifier",
		display: "Upchain Time Series",
		direction: "upchain",
		publish: 'true',
		computation: 'Instantaneous',
		period: 'Points'
	},{
		requestId: "derivedMeanTimeseriesIdentifier",
		display: "Daily Mean",
		direction: "downchain",
		publish: 'true',
		computation: 'Mean',
		period: 'Daily'
	},{
		requestId: "derivedMaxTimeseriesIdentifier",
		display: "Daily Max",
		direction: "downchain",
		publish: 'true',
		computation: 'Max',
		period: 'Daily'
	},{
		requestId: "derivedMinTimeseriesIdentifier",
		display: "Daily Min",
		direction: "downchain",
		publish: 'true',
		computation: 'Min',
		period: 'Daily'
	},{
		requestId: "derivedMedianTimeseriesIdentifier",
		display: "Daily Median",
		direction: "downchain",
		publish: 'true',
		computation: 'Median',
		period: 'Daily'
	}],
optionalRatingModels: [{ 
		requestId: "ratingModelIdentifier", 
		display: "Primary Rating Model", 
		bindTo: "primaryTimeseriesIdentifier"
	}]
});