AQCU.view.TimeSeriesSummaryFullReportView = AQCU.view.BaseReportView.extend({
	reportName: "Time Series Summary", 
	reportAbbreviation: "TSS",
	reportType: "timeseriessummary",
	excludedCorrections: [],
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createCorrectionExclusionSelector();
		this.bindToCorrectionExclusionSelectors(this.updateExcludedCorrections, this);
	},
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.excludedCorrections.length > 0) {
						reportOptions.excludedCorrections = this.excludedCorrections.join(',');
		}

		return reportOptions;
	}
	
});