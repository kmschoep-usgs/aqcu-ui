AQCU.view.DerivationChainReportView = AQCU.view.BaseReportView.extend({
	reportName: "Derivation Chain", 
	reportAbbreviation: "DC",
	reportType: "derivationchain",
	relatedTimeseriesConfig: [{
		requestId: "upchainTimeseriesIdentifier",
		display: "Upchain Time Series",
		direction: "upchain",
		required: false,
		computation: 'Instantaneous',
		period: 'Points'
	},{
		requestId: "derivedMeanTimeseriesIdentifier",
		display: "Daily Mean",
		direction: "downchain",
		required: false,
		computation: 'Mean',
		period: 'Daily'
	},{
		requestId: "derivedMaxTimeseriesIdentifier",
		display: "Daily Max",
		direction: "downchain",
		required: false,
		computation: 'Max',
		period: 'Daily'
	},{
		requestId: "derivedMinTimeseriesIdentifier",
		display: "Daily Min",
		direction: "downchain",
		required: false,
		computation: 'Min',
		period: 'Daily'
	},{
		requestId: "derivedMedianTimeseriesIdentifier",
		display: "Daily Median",
		direction: "downchain",
		required: false,
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