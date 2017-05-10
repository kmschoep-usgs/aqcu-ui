AQCU.view.TimeSeriesSummaryFullReportView = AQCU.view.BaseReportView.extend({
	reportName: "Time Series Summary", 
	reportAbbreviation: "TSS",
	reportType: "timeseriessummary",
	ratingModels: [{ 
			requestId: "ratingModelIdentifier", 
			display: "Primary Rating Model", 
			required: false,
			bindTo: "primaryTimeseriesIdentifier"
	}],
	excludedCorrections: "excludeDeleteRegion"
});