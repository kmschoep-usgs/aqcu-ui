/**
 * Utility functions and attributes to use browser storage
 */
AQCU.util.localStorage = function() {
	return {
		/**returns JSON**/
		getData: function(key) {
			var storedData = window["localStorage"][key];
			return storedData ? $.parseJSON(storedData) : null;
		},
		
		setData: function(key, json) {
			window["localStorage"][key] = JSON.stringify(json);
		}
	};
}();