AQCU.view.ExtremesReportView = AQCU.view.BaseReportView.extend({
	reportName: "Extremes",
	
	applyReportOptions: function() {
		//TODO actually construct this dynamically
		this.parentModel.set("requestParams", {
			reportType: "extremes",
			isHtml: true,
			primaryTimeseriesIdentifier: "a12d7fc43900440ab09e1ea48713f29d",
			upchainTimeseriesIdentifier: "f68ca269c90f44fcbda27b5f6d0a9858",
			derivedMeanTimeseriesIdentifier: "02f1fcfe54e24d648961c36edc3ffe37",
			ratingModelIdentifier: "Gage+height-Discharge.STGQ%4006893390"
		});
	}
});