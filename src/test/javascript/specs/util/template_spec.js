describe("template.js", function() {
	it("has these dependencies", function() {
	});

	it("defines these API functions and fields", function() {
		expect(AQCU.util.template).toBeDefined();
		expect(AQCU.util.template.templateBasePath).toBeDefined();
		expect(AQCU.util.template.getTemplate).toBeDefined();
	});
});

describe("AQCU.util.template.getTemplate", function() {
	it("it produces a Handlebars template of the returned data", function() {
		expect(AQCU.util.template.getTemplate("seleaaact-sites")).toBeDefined();
	});
});