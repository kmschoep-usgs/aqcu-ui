TestSupport = function() {
	if (!window.ga) {
		window.ga = function() {
		};
	}
	return {
		stubJQueryAjaxRequest: function() {
			sinon.stub($, "ajax");
		},
		restoreJQuerAjaxRequest: function() {
			$.ajax.restore();
		},
		initServer: function() {
			var _server = sinon.fakeServer.create();
			_server.autoRespond = true;
			return _server;
		},
		restoreServer: function(server) {
			server.restore();
		},
		setServerResponse: function(_server, xml) {
			_server.respondWith([
				200,
				{"Content-Type": "text"},
				xml
			]);
		},
		setServerXmlResponse: function(_server, xml) {
			_server.respondWith([
				200,
				{"Content-Type": "application/xml"},
				xml
			]);
		},
		setServerJsonResponse: function(_server, json) {
			_server.respondWith([
				200,
				{"Content-Type": "application/json"},
				json
			]);
		},
		setServerJsonResponseToRegex: function(_server, regex, json) {
			_server.respondWith(
					"GET",
					regex,
					[
						200,
						{"Content-Type": "application/json"},
						json
					]);
		},
		setServerTextResponseToRegex: function(_server, regex, text) {
			_server.respondWith(
					"GET",
					regex,
					[
						200,
						{"Content-Type": "text"},
						text
					]);
		},
		setServerJsonPostResponseToRegex: function(_server, regex, json) {
			_server.respondWith(
					"POST",
					regex,
					[
						200,
						{"Content-Type": "application/json"},
						json
					]);
		},
		//returns true if any object in the array has all combinations of key-value pairs in keyValsArray
		hasObjectWith: function(objArray, kvpsArray) {
			for (var i = 0; i < objArray.length; i++) {
				var obj = objArray[i];
				var allPropsFound = true;

				for (var j = 0; j < kvpsArray.length; j++) {
					var kvp = kvpsArray[j];
					if (obj[kvp.key] !== kvp.value) {
						allPropsFound = false;
						break;
					}
				}

				if (allPropsFound) {
					return true;
				}
			}

			return false;
		}
	};
}();

/**
 * All expected data below should align with the expected output of our webservices.
 */
TestSupport.data = {};

/**
 * Expected json data from a search model webservice call
 */
TestSupport.data.SearchModelJSONExample = '{"searchCategory":"A Category","searchType":"searchTypeKey","displayName":"Form Title","serviceView":"anNwisView","description":"*** Not Yet Described **"}';
TestSupport.data.SearchModelsJSON = '['
		+ TestSupport.data.SearchModelJSONExample
		+ ',{"searchCategory":"Site","searchType":"siteIdentifier","displayName":"Identifier","serviceView":"sitefile","description":"*** Not Yet Described **"}\
	]';


/**
 * Expected json data from a search model field webservice call
 */
TestSupport.data.SearchModelFieldsAllTypesJSONExample = '[\
	{"modelDisplayName":"Form Title","searchCategory":"A Category","searchType":"searchTypeKey","serviceView":"anNwisView",\
		"fieldName":"text_field_name_db_column","fieldType":"text","displayName":"Text Field Label",\
		"lookupType":"anNwisLookupType","subGroup":"Text Subgroup","defaultValue":"aDefaultValue","sortOrder":1}\
	,{"modelDisplayName":"Form Title","searchCategory":"A Category","searchType":"searchTypeKey","serviceView":"anNwisView",\
		"fieldName":"date_field_name_db_column","fieldType":"text","displayName":"Date Field Label",\
		"lookupType":"anNwisLookupType","subGroup":"Text Subgroup","defaultValue":"aDefaultValue","sortOrder":1}\
	,{"modelDisplayName":"Form Title","searchCategory":"A Category","searchType":"searchTypeKey","serviceView":"anNwisView",\
		"fieldName":"multi_field_name_db_column","fieldType":"multi","displayName":"Multi Field Label",\
		"lookupType":"anNwisLookupType","subGroup":"Lookup Subgroup","sortOrder":1}\
	,{"modelDisplayName":"Form Title","searchCategory":"A Category","searchType":"searchTypeKey","serviceView":"anNwisView",\
		"fieldName":"filtered_multi_field_name_db_column","fieldType":"multi","displayName":"Filtered Multi Field Label",\
		"lookupType":"anNwisLookupType2","filteredByFields":"multi_field_name_db_column","subGroup":"Lookup Subgroup","sortOrder":1}\
	]';
TestSupport.data.getSearchModelFieldJSONExample = function(fieldType) {
	if (!fieldType)
		fieldType = "text";

	return '{\
	"modelDisplayName":"Form Title",\
	"searchCategory":"A Category",\
	"searchType":"searchTypeKey",\
	"serviceView":"anNwisView",\
	"fieldName":"a_field_name_db_column",\
	"fieldType":"' + fieldType + '",\
	"displayName":"A Field Label",\
	"lookupType":"anNwisLookupType",\
	"subGroup":"A Subgroup To Appear Under",\
	"defaultValue":"aDefaultValue",\
	"sortOrder":1\
	}';
};
TestSupport.data.getSearchModelFieldsJSON = function(fieldType) {
	return '['
			+ TestSupport.data.getSearchModelFieldJSONExample(fieldType)
			+ ',{"modelDisplayName":"Identifier","searchCategory":"Site","searchType":"siteIdentifier","serviceView":"sitefile","fieldName":"agency_cd","fieldType":"multi","displayName":"Agency Code","lookupType":"agency","defaultValue":"USGS","sortOrder":10}\
	]';
};


/**
 * Expected json data from a report type webservice call
 */
TestSupport.data.ReportTypesJSON = {};

/**
 * Expected json data from a column groups webservice call
 */
TestSupport.data.ColumnGroupsJSON = {};