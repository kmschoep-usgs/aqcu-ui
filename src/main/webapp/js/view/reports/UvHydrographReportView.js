AQCU.view.UvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "UV Hydrograph",
	reportType: "swuvhydrograph",
	optionalRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage Height",
			parameter: "Gage height",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}],
	optionalRatingModels: [{ requestId: "ratingModelIdentifier", display: "Primary Rating Model", bindTo: "primaryTimeseriesIdentifier"}]
});