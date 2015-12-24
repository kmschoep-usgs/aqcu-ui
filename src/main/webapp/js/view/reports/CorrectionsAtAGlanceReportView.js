AQCU.view.CorrectionsAtAGlanceReportView = AQCU.view.BaseReportView.extend({
	reportName: "Corrections At A Glance",
	reportType: "correctionsataglance",
	optionalRatingModels: [{ 
		requestId: "ratingModelIdentifier", 
		display: "Primary Rating Model", 
		bindTo: "primaryTimeseriesIdentifier"
	}]
});