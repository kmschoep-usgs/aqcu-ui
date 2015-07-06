/**
 * Utility functions to help convert search model data into query parameters
 */
AQCU.util.query = function() {
	return {
		/**
		 * Helper function, collects all search criteria from all search models.
		 * @returns JSON object with all search parameters
		 */
		getQueryAllParameters: function(models, distinct) {
			var criteria = {};
			for (var key in models) {
				var model = models[key];
				var modelParams = AQCU.util.query.getQueryParametersFromModel(model);
				$.extend(criteria, modelParams);
			}

			if (distinct) {
				criteria.distinct = true;
			}

			return criteria;
		},
		/**
		 * Helper function. Cycles through search model and produces a JSON object which reflects
		 * the select search criteria.
		 * 
		 * @returns all search criteria in JSON form
		 */
		getQueryParametersFromModel: function(model) {
			var searchCriteria = {};
			var params = model.attributes;
			for (var key in params) {
				var paramName = key;
				//check if there is a serviceFieldName associated with this field
				for (var i = 0; i < model.fieldConfig.length; i++) {
					if (model.fieldConfig[i].fieldName == key && model.fieldConfig[i].serviceFieldName) {
						paramName = model.fieldConfig[i].serviceFieldName;
						break;
					}
				}

				paramName = model.serviceView + "." + paramName;

				//check if there is an exp type associated with this field
				for (var i = 0; i < model.fieldConfig.length; i++) {
					if (model.fieldConfig[i].fieldName == key && model.fieldConfig[i].exp) {
						paramName += "." + model.fieldConfig[i].exp;
						break;
					}
				}

				//check for dataType, concatenate 4th part of param name
				if (paramName.split(".").length == 3) {
					for (var i = 0; i < model.fieldConfig.length; i++) {
						if (model.fieldConfig[i].fieldName == key && model.fieldConfig[i].dataType) {
							paramName += "." + model.fieldConfig[i].dataType;
							break;
						}
					}
				}

				//check for trim, concatenate 5th part of param name
				if (paramName.split(".").length == 4) {
					for (var i = 0; i < model.fieldConfig.length; i++) {
						if (model.fieldConfig[i].fieldName == key && model.fieldConfig[i].trim == "Y") {
							paramName += ".trim";
							break;
						}
					}
				}

				var value = params[key];

				//if two fields are using the same field name, we send the parameter in an
				//array of values, this produces an AND query on the backend.
				if (searchCriteria[paramName]) {
					if (searchCriteria[paramName] instanceof Array) {
						searchCriteria[paramName].push(value);
					} else {
						var v = searchCriteria[paramName];
						searchCriteria[paramName] = [];
						searchCriteria[paramName].push(v);
						searchCriteria[paramName].push(value);
					}
				} else {
					searchCriteria[paramName] = value;
				}
			}
			return searchCriteria;
		},
		/**
		 * Helper function. Given a field name, looks in the search model's fieldConfig to find the display value for that field.
		 * @param searchModel
		 * @param key
		 * @returns display name
		 */
		getDisplayNameFromConfig: function(searchModel, key) {
			for (var i = 0; i < searchModel.fieldConfig.length; i++) {
				if (key == searchModel.fieldConfig[i].fieldName) {
					return searchModel.fieldConfig[i].displayName;
				}
			}
			return key;
		},
		/**
		 * Helper function. Given a field name, looks in the search model's fieldConfig to find the display value for that field.
		 * @param searchModel
		 * @param key
		 * @returns display name
		 */
		isRangeTypeField: function(searchModel, key) {
			for (var i = 0; i < searchModel.fieldConfig.length; i++) {
				if (key == searchModel.fieldConfig[i].fieldName &&
						(searchModel.fieldConfig[i].fieldType == "partialdate" || searchModel.fieldConfig[i].fieldType == "range")) {
					return true;
				}
			}
			return false;
		},
		/**
		 * Helper function. Empty strings and null attributes are still sent to the
		 * server as chosen attributes by default, resulting in zero search results.
		 * This removes the empty/null search fields so it does not send to the
		 * webservice.
		 */
		pruneModel: function(model) {
			for (var k in model.attributes) {
				if (model.attributes[k] === null || model.attributes[k] === '') { // removes
					// explicit
					// null
					// and
					// empty
					// strings
					delete model.attributes[k];
				}
			}
			return model;
		}
	};
}();