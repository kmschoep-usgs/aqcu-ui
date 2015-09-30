AQCU.view.SensorReadingSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Sensor Reading Summary",
	reportType: "sensorreadingsummary",
	optionalRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage Height",
			parameter: "Discharge",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "upchainTimeseriesIdentifier",
			display: "Precipitation",
			parameter: "Precipitation",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}]
});

