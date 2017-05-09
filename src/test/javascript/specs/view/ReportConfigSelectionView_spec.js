describe("ReportConfigSelectionView.js", function() {
	var thisTemplate;
	var thisParentModel;
	var savedReportsControllerSpy;
	var thisDateSelection = {lastMonths: 12};
	var thisDefaultFormat = "html";
	var testParams = {baseField: true,
			requestId: "testIdentifier",
			display: "Stat Derived Time Series 1",
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
			templateName: thisTemplate,
			savedReportsController: savedReportsControllerSpy,
			selectedTimeSeries: thisSelectedTimeSeries,
			processorTypesFetched: getProcessorPromise,
			availableReportsPopulated: getReportsPromise,
			availableReportViews: thisAvailableReportViews,
			availableReports: thisAvailableReports,
			el : $('#test-div'),
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
	
	/*
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
*/
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
		
		expect(view.availableReports.length).toEqual(6);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.VDiagramReportView);
		expect(view.availableReports).toContain(AQCU.view.DvHydrographReportView);
		
		testProcessors = {"upChain": ["testone","somethingelse"], "downChain": ["statistics","processortwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "MEAN",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "discharge",
				timeSeriesType: "processorderived",
				processorTypes: testProcessors,
				period: "daily",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(5);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.DvHydrographReportView);
		
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
		
		expect(view.availableReports.length).toEqual(5);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.DvHydrographReportView);
		
		testProcessors = {"upChain": ["testone","somethingelse"], "downChain": ["anotherthing","processortwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "mean",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "DISCHARGE",
				timeSeriesType: "processorderived",
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
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		
		testProcessors = {"upChain": ["testone","SomethingElse"], "downChain": ["ANOTHERTHING","processortwo"]};
		thisSelectedTimeSeriesPT = {
				computation: "Instantaneous",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "discharge",
				timeSeriesType: "PROCESSORDERIVED",
				processorTypes: testProcessors,
				period: "points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(5);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.UvHydrographReportView);
		
		
		testProcessors = {"upChain": ["testOne","ratingmodel"], "downChain": ["anotherthing","ProcessorTWO"]};
		thisSelectedTimeSeriesPT = {
				computation: "instantaneous",
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
		
		expect(view.availableReports.length).toEqual(5);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.UvHydrographReportView);
		
		testProcessors = {"upChain": ["testOne","somethingelse"], "downChain": ["anotherThing","processortwo","ratingmodel"]};
		thisSelectedTimeSeriesPT = {
				computation: "INSTANTANEOUS",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "DiScHaRgE",
				timeSeriesType: "Processorderived",
				processorTypes: testProcessors,
				period: "POINTS",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft^3/s"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(5);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).toContain(AQCU.view.UvHydrographReportView);
		
		testProcessors = {"upChain": ["testOne","RATINGModel"], "downChain": ["AnotherThing","ProcessorTwo","statistics"]};
		thisSelectedTimeSeriesPT = {
				computation: "test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "water level, DEPTH LSD",
				timeSeriesType: "processorderived",
				processorTypes: testProcessors,
				period: "PoInTs",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(8);
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.VDiagramReportView);
		expect(view.availableReports).toContain(AQCU.view.FiveYearGWSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.DvHydrographReportView);
		expect(view.availableReports).toContain(AQCU.view.SiteVisitPeakReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).not.toContain(AQCU.view.UvHydrographReportView);
		
		
		testProcessors = {"upChain": ["testOne","RatingModel"], "downChain": ["AnotherThing","ProcessorTwo","statistics"]};
		thisSelectedTimeSeriesPT = {
				computation: "Test",
				description: "fake time series for testing view",
				identifier: "fake time series 1",
				parameter: "gage height.ft",
				timeSeriesType: "processorDerived",
				processorTypes: testProcessors,
				period: "points",
				primary: true,
				publish: true,
				uid: "br549",
				units: "ft"
			};
		
		d.resolve(testProcessors);
		view.populateAvailableReports(thisSelectedTimeSeriesPT);
		
		expect(view.availableReports.length).toEqual(7);
		
		expect(view.availableReports).toContain(AQCU.view.CorrectionsAtAGlanceReportView);
		expect(view.availableReports).toContain(AQCU.view.ExtremesReportView);
		expect(view.availableReports).toContain(AQCU.view.SensorReadingSummaryReportView);
		expect(view.availableReports).toContain(AQCU.view.SiteVisitPeakReportView);
		expect(view.availableReports).toContain(AQCU.view.VDiagramReportView);
		expect(view.availableReports).toContain(AQCU.view.DvHydrographReportView);
		expect(view.availableReports).toContain(AQCU.view.TimeSeriesSummaryFullReportView);
		expect(view.availableReports).not.toContain(AQCU.view.FiveYearGWSummaryReportView);
	});
	
});

