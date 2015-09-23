AQCU.view.SensorReadingSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Sensor Reading Summary",
	reportType: "sensorreadingsummary",
	requiredRelatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Gage height",
			direction: "upchain",
			parameter: "Gage height",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		}]
});

