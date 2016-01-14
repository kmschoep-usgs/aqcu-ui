AQCU.controller.SavedReportsController = function() {
	var LOCAL_STORAGE_KEY = "aqcu_saved_reports";
	var registeredModels = [];
	
	var _updateRegisteredModels = function(reports) {
		for(var i = 0; i < registeredModels.length; i++) {
			registeredModels[i].set("savedReports", reports);
		}
	};
	
	return {
		saveReport : function(reportType, reportName, format, requestMetadata, requestParameters) {
			var savedReportVal = {
					reportType : reportType,
					reportName : reportName, 
					format : format,
					requestMetadata : requestMetadata,
					requestParameters : requestParameters
			}
			
			var reports = AQCU.controller.SavedReportsController.getSavedReports();
			reports.push(savedReportVal);
			AQCU.controller.SavedReportsController.setSavedReports(reports);
			_updateRegisteredModels(reports);
		},
		
		saveAllReports: function(savedReportsArray) {
			var reports = AQCU.controller.SavedReportsController.getSavedReports();
			for(var i = 0; i < savedReportsArray.length; i++) {
				reports.push(savedReportsArray[i]);
			}
			AQCU.controller.SavedReportsController.setSavedReports(reports);
		},
		
		getSavedReports : function() {
			var savedReports = AQCU.util.localStorage.getData(LOCAL_STORAGE_KEY) || [];
			return savedReports;
		},
		
		setSavedReports : function(savedReports) {
			AQCU.util.localStorage.setData(LOCAL_STORAGE_KEY, savedReports);
			_updateRegisteredModels(savedReports);
		},
		
		deleteSavedReportAtIndex : function(index) {
			var reports = AQCU.controller.SavedReportsController.getSavedReports();
			var newReportsList = []
			for(var i = 0; i < reports.length; i++) {
				if(i != index) {
					newReportsList.push(reports[i]);
				}
			}
			AQCU.controller.SavedReportsController.setSavedReports(newReportsList);
		},
		
		//given a model, will make sure to update it with any changes to the saved reports
		registerModel : function(savedReportModel) {
			registeredModels.push(savedReportModel);
		}
	};
}();