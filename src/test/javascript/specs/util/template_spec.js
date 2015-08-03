describe("template.js", function() {
	it("has these dependencies", function() {
		expect(AQCU.util.template).toBeDefined();
	});
	it("defines these API functions and fields", function() {
		expect(AQCU.util.template).toBeDefined();
		expect(AQCU.util.template.templateBasePath).toBeDefined();
		expect(AQCU.util.template.getTemplate).toBeDefined();
	});
});

describe("AQCU.util.template.getTemplate", function() {
	it("it produces a Handlebars template of the returned data", function() {
		// TODO to have ajax work you need to do some special file access
		// TODO I have had this working in MyPubs jasmine test in June 2014
		// disabled until file loading enabled
//		expect(AQCU.util.template.getTemplate("seleaaact-sites")).toBeDefined(); //TODO actually test the resolution of the promise
		expect(AQCU.util.template).toBeDefined(); // TODO remove this test when files are loaded
	});
});