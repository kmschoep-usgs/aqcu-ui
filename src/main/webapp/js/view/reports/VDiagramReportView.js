AQCU.view.VDiagramReportView = AQCU.view.BaseReportView.extend({
	reportName: "V-Diagram",
	reportType: "swreviewvdiagram",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage Height",
			parameter: "Gage height",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}],
	requiredRatingModels: [{ requestId: "ratingModelIdentifier", display: "Primary Rating Model", bindTo: "primaryTimeseriesIdentifier"}]
});