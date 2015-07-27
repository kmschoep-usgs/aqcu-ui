describe("Javascript importing", function() {
	//this is only imported during and required for testing
	it("loads sinon library for testing support", function() {
		expect(sinon).toBeDefined();
	});

	it("loads Backbone library", function() {
		expect(Backbone).toBeDefined();
	});

	it("loads jquery library", function() {
		expect($).toBeDefined();
	});

	it("loads underscore.js library", function() {
		expect(_).toBeDefined();
	});
});

describe("AQCU namespace generation", function() {
	it("defines all major AQCU namespaces", function() {
		expect(AQCU).toBeDefined();

		expect(AQCU.model).toBeDefined();
		expect(AQCU.view).toBeDefined();
		expect(AQCU.controller).toBeDefined();
		expect(AQCU.util).toBeDefined();
		expect(AQCU.templates).toBeDefined();
	});
});
