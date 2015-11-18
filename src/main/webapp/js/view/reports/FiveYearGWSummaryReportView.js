AQCU.view.FiveYearGWSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Five Year GW Summary",
	reportType: "fiveyeargwsummary",
	optionalRelatedTimeseriesConfig: [{			
			requestId: "firstDownChainIdentifier",
			display: "First Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily'
		},{
			requestId: "secondDownChainIdentifier",
			display: "Second Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily'
		},{
			requestId: "thirdDownChainIdentifier",
			display: "Third Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily'
		},{
			requestId: "secondaryTimeseriesIdentifier",
			display: "Secondary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "tertiaryTimeseriesIdentifier",
			display: "Tertiary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "quaternaryTimeseriesIdentifier",
			display: "Quaternary Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}]
	
});

