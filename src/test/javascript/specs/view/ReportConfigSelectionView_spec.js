describe("ReportConfigSelectionView.js", function() {
	var thisTemplate;
	var thisParentModel;
	var savedReportsControllerSpy;
	var thisDateSelection = {lastMonths: 12};
	var thisDefaultFormat = "html";
	var testParams = {baseField: true,
			requestId: "testIdentifier",
			display: "First Downchain Stat Derived Time Series",
			direction: "downchain",
			parameter: "Discharge",
			defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		};
	var testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["Statistics","ProcessorTwo"]};
	var deferred, processorTypesFetched, availableReportsPopulated;
	var getProcessorPromise, getReportsPromise;
	var fetchProcessorTypesSpy;
	var $testDiv;
	var server;
	var view;
	var thisSelectedTimeSeries, thisSelectedTimeSeriesPT;
	var thisAvailableReportViews, thisAvailableReports;
	
	
	beforeEach(function() {
				
		deferred = $.Deferred();
		processorTypesFetched = $.Deferred();
		availableReportsPopulated = $.Deferred();
		getProcessorPromise = jasmine.createSpy('getProcessorPromiseSpy').and.returnValue(processorTypesFetched.promise());
		getReportsPromise = jasmine.createSpy('getReportsPromiseSpy').and.returnValue(availableReportsPopulated.promise());
		
		$('body').append('<div id="test-div"></div>');
		$testDiv = $('#test-div');
		var html = '<div class="available-reports"><i class="loading-indicator fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i></div>';
		$testDiv.append(html);
		thisTemplate = jasmine.createSpy('thisTemplate');
		savedReportsControllerSpy = jasmine.createSpy('savedReportsControllerSpy');		
		server = sinon.fakeServer.create();
		thisAvailableReportViews = [];
		thisAvailableReports = [];
		thisSelectedTimeSeriesPT = {
				computation: "Mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Daily",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		thisSelectedTimeSeries = {
				computation: "Mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				period: "Daily",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		view = new AQCU.view.ReportConfigSelectionView({
			template : thisTemplate,
			savedReportsController: savedReportsControllerSpy,
			selectedTimeSeries: thisSelectedTimeSeries,
			processorTypesFetched: getProcessorPromise,
			availableReportsPopulated: getReportsPromise,
			availableReportViews: thisAvailableReportViews,
			availableReports: thisAvailableReports,
			parentModel : new Backbone.Model({
				site: '1234',
				selectedTimeSeries: thisSelectedTimeSeries,
				dateSelection: thisDateSelection,
				format: thisDefaultFormat
			})
		});
		
	});
	
	afterEach(function() {
		$testDiv.remove();
		server.restore();
	});
	
	it('Expects the appropriate properties to be defined after instantiation', function() {		
		expect(view.savedReportsController).toBeDefined();
		expect(view.ajaxCalls).toBeDefined();
		expect(view.bindings).toBeDefined();
		expect(view.parentModel).toBeDefined();
		expect(view.availableReportViews).toBeDefined();
		expect(view.availableReports).toBeDefined();
		
	});
	
	it('Expects fetchProcessorTypes to make an ajax call', function(){
		var requestCount = server.requests.length;

		view.fetchProcessorTypes(thisSelectedTimeSeries);
		expect(server.requests.length).toBe(requestCount + 1);
		var thisRequest = server.requests[1];
		expect(thisRequest.url).toMatch(AQCU.constants.serviceEndpoint + "/service/lookup/timeseries/processorTypes");
		expect(thisRequest.url).toMatch(thisSelectedTimeSeries.uid);
	});
	
	it('Expects a successful fetchProcessorTypes to return a deferred which resolves to processor types', function() {
		//testView = new NWC.view.StreamflowStatsGageDataView(options);
		var doneSpy = jasmine.createSpy('doneSpy');

		var response = testProcessors;

		view.fetchProcessorTypes(thisSelectedTimeSeries).done(doneSpy);
		expect(doneSpy).not.toHaveBeenCalled();
		server.respond([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
		expect(doneSpy).toHaveBeenCalledWith(response);
	});
	
	it('Expects a successful createReportViews to add processor types to selectedTimeSeries object', function() {
		var doneSpy = jasmine.createSpy('doneSpy');
		var response = testProcessors;
		view.fetchProcessorTypes(thisSelectedTimeSeries).done(doneSpy);
		server.respond([200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
		view.createReportViews();
		expect(view.selectedTimeSeries.processorTypes.upChain).toEqual(["testOne","RatingModel"]);
		expect(view.selectedTimeSeries.processorTypes.downChain).toEqual(["Statistics","ProcessorTwo"]);
	});

	it('Expects that when createReportViews is called, fetchProcessorTypes is called', function() {
		var d = $.Deferred();
		spyOn(AQCU.view.ReportConfigSelectionView.prototype, 'fetchProcessorTypes').and.callFake(function() {
			return d;
		});
		d.resolve(testProcessors);
		view.createReportViews();
		expect(view.fetchProcessorTypes).toHaveBeenCalled();
	});
	
	it('Expects that when createReportViews is called, populateAvailableReports is called', function() {
		var d = $.Deferred();
		var a = $.Deferred();
		spyOn(AQCU.view.ReportConfigSelectionView.prototype, 'fetchProcessorTypes').and.callFake(function() {
			return d;
		});
		d.resolve(testProcessors);
		spyOn(AQCU.view.ReportConfigSelectionView.prototype, 'populateAvailableReports').and.callFake(function() {
			return a;
		});
		a.resolve([AQCU.view.ReportConfigSelectionView]);
		view.createReportViews();
		expect(view.populateAvailableReports).toHaveBeenCalled();
	});
	
	it('Expects that when populateAvailableReports is called, the appropriate views appear', function() {
		var d = $.Deferred();
		spyOn(AQCU.view.ReportConfigSelectionView.prototype, 'fetchProcessorTypes').and.callFake(function() {
			return d;
		});
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(5);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["Statistics","ProcessorTwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Daily",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(4);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["AnotherThing","ProcessorTwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Daily",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(4);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["AnotherThing","ProcessorTwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(3);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["AnotherThing","ProcessorTwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Instantaneous",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(4);
		
		testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["AnotherThing","ProcessorTwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Instantaneous",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "Computed",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(4);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["AnotherThing","ProcessorTwo","RatingModel"]};
		thisSelectedTimeSeriesPT = {
				computation: "Instantaneous",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(4);
		
		testProcessors = {"upChain": ["testOne","SomethingElse"], "downChain": ["AnotherThing","ProcessorTwo","Thing"]};
		thisSelectedTimeSeriesPT = {
				computation: "test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "particles of dust",
				timeSeriesType: "Whatever",
				processorTypes: testProcessors,
				period: "Infinity",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(3);
		
		testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["AnotherThing","ProcessorTwo","Statistics"]};
		thisSelectedTimeSeriesPT = {
				computation: "test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Water level, depth LSD",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(7);
		
		testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["AnotherThing","ProcessorTwo","Statistics"]};
		thisSelectedTimeSeriesPT = {
				computation: "test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Discharge.ft^3/s",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(5);
		
		testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["AnotherThing","ProcessorTwo","Statistics"]};
		thisSelectedTimeSeriesPT = {
				computation: "test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "Gage height.ft",
				timeSeriesType: "ProcessorDerived",
				processorTypes: testProcessors,
				period: "Points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(6);
	});
	
});

