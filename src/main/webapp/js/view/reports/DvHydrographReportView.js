AQCU.view.DvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "DV Hydrograph",
	reportType: "dvhydrograph",
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
			requestId: "dvSecondaryReferenceIdentifier",
			display: "Secondary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "dvTertiaryReferenceIdentifier",
			display: "Tertiary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		},{
			requestId: "dvQuaternaryReferenceIdentifier",
			display: "Quaternary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}]
	
});
