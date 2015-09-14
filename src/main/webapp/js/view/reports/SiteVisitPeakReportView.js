AQCU.view.SiteVisitPeakReportView = AQCU.view.BaseReportView.extend({
	reportName: "Site Visit Peak",
	reportType: "sitevisitpeak",
	optionalRelatedTimeseriesConfig: [
		//Also might be unnecessary. Unsure if sublocation is something you display or what?
		{
			requestId: "sublocation",
			display: "Sublocation",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}]
});


