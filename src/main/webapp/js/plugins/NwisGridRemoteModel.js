(function($) {
	/***
	 * THIS IS AN EXAMPLE: copied from slick.remotemodel.js, will be replacing with code with uses nwis services
	 */
	function NwisRemoteGridModel(options) {
		var router = options.router;

		// private
		var PAGESIZE = options.pageSize || 50;
		var service = options.serviceUrl;
		var data = {length: 0};
		var searchstr = "";
		var sortcol = null;
		var sortdir = 1;
		var h_request = null;
		var req = null; // ajax request

		// events
		var onDataLoading = new Slick.Event();
		var onDataLoaded = new Slick.Event();


		function init() {
		}


		function isDataLoaded(from, to) {
			for (var i = from; i <= to; i++) {
				if (data[i] == undefined || data[i] == null) {
					return false;
				}
			}

			return true;
		}


		function clear() {
			for (var key in data) {
				delete data[key];
			}
			data.length = 0;
		}
		
		function onError(fromPage, toPage, err, status) {
			if (console && console.log)
				console.log(err + " error loading pages " + fromPage + " to " + toPage + ". Status: " + status);
		}
		
		function onSuccess(json) {
			var from = parseInt(json.startingRow), to = from + parseInt(json.pageSize);
			data.length = parseInt(json.totalCount); // limitation of the API

			for (var i = 0; i < json.records.length; i++) {
				var item = json.records[i];

				data[from + i] = item;
				data[from + i].index = from + i;
			}

			req = null;

			onDataLoaded.notify({from: from, to: to});
		}


		function ensureData(from, to) {
			if (req) {
				req.abort();
				for (var i = req.fromPage; i <= req.toPage; i++)
					data[i * PAGESIZE] = undefined;
			}

			if (from < 0) {
				from = 0;
			}

			if (data.length > 0) {
				to = Math.min(to, data.length - 1);
			}

			var fromPage = Math.floor(from / PAGESIZE);
			var toPage = Math.floor(to / PAGESIZE);

			while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
				fromPage++;

			while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
				toPage--;

			if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined)) {
				// TODO:  look-ahead
				onDataLoaded.notify({from: from, to: to});
				return;
			}

			var url = service + "?row=" + (fromPage * PAGESIZE) + "&pageSize=" + (((toPage - fromPage) * PAGESIZE) + PAGESIZE);

			if (sortcol != null) {
				url += ("&sortby=" + sortcol + ((sortdir > 0) ? "+asc" : "+desc"));
			}

			if (h_request != null) {
				clearTimeout(h_request);
			}

			_this = this;
			h_request = setTimeout(function() {
				for (var i = fromPage; i <= toPage; i++)
					data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'

				onDataLoading.notify({from: from, to: to});
				req = $.ajax({
					url: url,
					dataType: "json",
					data: options.data,
					traditional: true,
					success: onSuccess,
					timeout: 120000,
					cache: false,
					error: function(response, err, status) {
						if (status == "timeout") {
							router.unknownErrorHandler(response, err, status);
						}
						onError(fromPage, toPage, err, status);
					},
					context: router
				});
				req.fromPage = fromPage;
				req.toPage = toPage;
				_this.req = req;
			}, 250);
		}

		function reloadData(from, to) {
			for (var i = from; i <= to; i++)
				delete data[i];

			ensureData(from, to);
		}


		function setSort(column, dir) {
			sortcol = column;
			sortdir = dir;
			clear();
		}

		function setSearch(str) {
			searchstr = str;
			clear();
		}

		function cancelAjax() {
			if (this.req) {
				this.req.abort();
			}
		}

		init();

		return {
			// properties
			"data": data,
			// methods
			"clear": clear,
			"isDataLoaded": isDataLoaded,
			"ensureData": ensureData,
			"reloadData": reloadData,
			"setSort": setSort,
			"setSearch": setSearch,
			"cancelAjax": cancelAjax,
			// events
			"onDataLoading": onDataLoading,
			"onDataLoaded": onDataLoaded
		};
	}

	// Slick.Data.RemoteModel
	$.extend(true, window, {AQCU: {model: {NwisRemoteGridModel: NwisRemoteGridModel}}});
})(jQuery);
