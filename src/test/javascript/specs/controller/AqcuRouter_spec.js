describe("AqcuRouter.js", function() {
	it("has these dependencies", function() {
		expect(Backbone.Router).toBeDefined();
		expect(AQCU.view.TimeSeriesView).toBeDefined();
	});

	it("defines these API functions and fields", function() {
		expect(AQCU.controller.AqcuRouter.prototype.showTimeSeriesView).toBeDefined();
	});
});

describe("AQCU.controller.AqcuRouter", function() {
	var server;
	beforeEach(function() {
		server = TestSupport.initServer();
	});

	afterEach(function() {
		TestSupport.restoreServer(server);
	});


	it("has routes and corresponding handlers which display the correct views", function() {
		var testRouter = new AQCU.controller.AqcuRouter();

		//goes to homepage
		expect(testRouter.routes['']).toBe('showTimeSeriesView');
		testRouter.showTimeSeriesView();
		expect(testRouter.currentView).toBeDefined();
		expect(testRouter.currentView instanceof AQCU.view.TimeSeriesView).toBeTruthy();
		testRouter.removeCurrentView();
	});

	it("has function that correctly updates version tag", function() {
		//dummy version div to be placed on page
		var versionDiv = $('<div>').attr({id: 'aqcu_version_tag'});
		$(document.body).append(versionDiv);

		//set up fake responses to all expected ajax calls
		TestSupport.setServerTextResponseToRegex(server, /.*version.*/, "version=TEST_VERSION "); //response

		var testRouter = new AQCU.controller.AqcuRouter();
		testRouter.loadVersionTag();

		//make the fake server respond with all of the test data
		server.respond();

		expect($("#aqcu_version_tag").html()).toBe('version: TEST_VERSION');

		versionDiv.remove();
	});


	it("has function which correctly checks for logged out session and does proper forwarding", function() {
		//TODO
	});


	it("has general/generic error handling/displaying functions", function() {
		//TODO
	});
});
