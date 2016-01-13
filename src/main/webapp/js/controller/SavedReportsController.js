AQCU.controller.SavedReportsController = function() {
	
	return {
		saveReport : function(reportType, reportName, format, requestMetadata, requestParameters) {
			var savedReportVal = {
					reportType : reportType,
					reportName : reportName, 
					format : format,
					requestMetadata : requestMetadata,
					requestParameters : requestParameters
			}
			console.log(savedReportVal)
			alert("TODO: save to storage")
		}
	};
}();