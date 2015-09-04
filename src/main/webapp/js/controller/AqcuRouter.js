/**
 * Implementation of Backbone Router (see Backbone docs).
 * 
 * Also contains application state information (active search models and output options).
 */
AQCU.controller.AqcuRouter = Backbone.Router.extend({
	/**
	 * Container div in HTML. May want to inject this.
	 */
	applicationContentDiv: '#aqcu-ui-content', //selector for container div of application
 
	initialize: function() {
		this.bind('route', this.pageView);
	},
	pageView: function() {
		var path = Backbone.history.getFragment();
		ga('send', 'pageview', {
			page: '/' + path
		});
	},
	/**
	 * Backbone router routes
	 */
	routes: {
		"": "showTimeSeriesView"
	},
	/**
	 * The active output options model that can be reset to the latest values
	 */
	activeOutputOptionsModel: null,

	/**
	 * Go to time series home
	 */
	showTimeSeriesView: function() {
		this.showView(AQCU.view.TimeSeriesView);
	},
	
	/**
	 * TODO remove this class and code when new UI is complete enough
	 * Go to time series report criteria view.
	 */
	showTimeSeriesPrototypeView: function() {
		this.showView(AQCU.view.TimeSeriesPrototypeView);
	},
	
	showView: function(view, opts) {
		this.removeCurrentView();
		var newEl = $('<div>');
		$(this.applicationContentDiv).append(newEl);
		this.currentView = new view($.extend({
			el: newEl,
			router: this
		}, opts));
	},
	/**
	 * Helper function. Removes all current application state by deleting the attributes entirely.
	 */
	resetApplicationState: function() {
		//delete or reset application state
		//eg: delete this.someVar;
	},

	/**
	 * Simply checks to see if the state has a view defined and removes it if so.
	 */
	removeCurrentView: function() {
		if (this.currentView) {
			this.currentView.remove();
		}
	},
	
	/**
	 * Will do an ajax call to a version file on the server, and will parse that into a tag on
	 * the page
	 */
	loadVersionTag: function() {
		$.ajax({
			url: "version",
			async: false,
			dataType: "text",
			success: function(data) {
				var version = data.match(/version=.*\s/g)[0];
				version = version.replace(/version=/, "").trim();
				$("#aqcu_version_tag").html("version: " + version);
			},
			error: this.unknownErrorHandler,
			context: this
		});
	},
	
	unknownErrorHandler: function(response, err, status) {
		//status is assumed to be an exception when not a string
		var lcStatus = status && typeof status === "string" ?
				status.toLowerCase() : 'exception';

		if (lcStatus === "abort" || lcStatus === "exception") {
			//do nothing, something in the code intentionally aborted.
			// send analytics event
			ga('send', 'exception', {
				'exDescription': 'abortError'
			});
			this.checkSession(null, response);
		} else if (lcStatus === "timeout") {
			var _this = this;
			this.errorPopup = new AQCU.view.PopupView(
					{
						title: "Request timeout",
						message: "The webrequest has timed out. Reload the page and try again.",
						callback: function() {
							_this.errorPopup = null;
						}
					}
			);
			ga('send', 'exception', {
				'exDescription': 'timeoutError',
				'exFatal': false
			});
		} else {
			var xml;
			try {
				xml = jQuery.parseXML(response.responseText);
			} catch (e) {
			}
			this.displayUnknownError(xml);
		}
	},
	
	/**
	 * This helper function will examine the xml error response. If the status is INTERNAL_SERVER_ERROR,
	 * the function will display a popup and return true to signal that the error is unknown. 
	 * @param xml
	 */
	displayUnknownError: function(xml) {
		var status,
				serviceId,
				_this = this,
				message = '<span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 50px 0;"></span>',
				supportContactString = AQCU.constants.helpEmail ?
				"Please email support at <a href=\"mailto:" + AQCU.constants.helpEmail + "?subject=NWIS-RA Timeseries\">here</a>." :
				'Please send contact support by using the feedback link at the bottom of the page.';

		if (_this.errorPopup) {
			_this.errorPopup.remove();
		}

		if (!xml) {
			_this.errorPopup = new AQCU.view.PopupView({
				title: "No response from server",
				message: supportContactString,
				callback: function() {
					_this.errorPopup = null;
				}
			});
			ga('send', 'exception', {
				'exDescription': 'timeoutError',
				'exFatal': false
			});
		} else {
			$(xml).find('status').each(function(i, r) {
				status = $(r).text();
			});
			$(xml).find('message').each(function(i, r) {
				message += $(r).text();
			});

			//if this error is not INTERNAL_SERVER_ERROR and the message does not have the word unknown, 
			//but we DO have xml response, return false and do not handle.
			if (status.toUpperCase() !== "INTERNAL_SERVER_ERROR" && message.toLowerCase().indexOf("unknown") < 0 && xml) {
				return false;
			}

			$(xml).find('serviceId').each(function(i, r) {
				serviceId = $(r).text();
			});

			message += "<br/><br/>The error has been logged with a service ID of #" + serviceId
					+ "<br/><br/>To report this error, send an email <a href=\"mailto:" + AQCU.constants.helpEmail +
					"?subject=NWISRA%20Timeseries%20User%20Report%20(" + serviceId + ")\">here</a>.<br/><br/>" +
					"If the hyperlink does not work, send an email to <b>\"" + AQCU.constants.helpEmail + "\"</b> with the subject line " +
					"<b>\"NWIS-RA Timeseries User Report (" + serviceId + ")\"</b>";

			this.errorPopup = new AQCU.view.PopupView({
				title: "Uknown Server Error #" + serviceId,
				message: message,
				callback: function() {
					_this.errorPopup = null;
				}
			});
			ga('send', 'exception', {
				'exDescription': 'unknownError',
				'exFatal': false
			});
		}
		return true;
	},
	clearErrors: function() {
		if (this.errorPopup) {
			this.errorPopup.remove();
			delete this.errorPopup;
		}
	},
	startDownload: function(sourceUrl, data, format) {
		var url = sourceUrl,
				href = window.location.href,
				hash = window.location.hash,
				path = window.location.pathname,
				pathParts = path.split('/'),
				fullUrl;

		url = url.replace("paged", "streaming") + "/" + format + "?" + jQuery.param(data, true);
		fullUrl = url;

		window.open(fullUrl,'Download ' + new Date().getMilliseconds());

		ga('send', 'event', {
			'eventCategory': 'reportDownload',
			'eventAction': 'click',
			'eventLabel': url.substring(0, url.indexOf('?'))
		});

		ga('send', 'pageview', {
			page: fullUrl
		});

	},
	checkSession: function(req, resp) {
		var resText = resp.responseText;
		if (resText) {
			var headerInfo = resText.substring(resText.indexOf('<head>'), resText.indexOf('</head>'));
			var isLoginPage = (headerInfo.indexOf('<meta name="description" content="Vision login" />') > -1);
			if (isLoginPage) {
				window.location = "login.jsp?timedOut=true";
			}
		}
	}
});
