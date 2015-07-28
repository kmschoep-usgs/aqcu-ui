describe("template.js", function() {
<<<<<<< HEAD
	it("has these dependencies", function() {
	});

=======
>>>>>>> 8fef2059ccdc1d5adfcfab3c6b02f98498d6d1d3
	it("defines these API functions and fields", function() {
		expect(AQCU.util.template).toBeDefined();
		expect(AQCU.util.template.templateBasePath).toBeDefined();
		expect(AQCU.util.template.getTemplate).toBeDefined();
	});
});

describe("AQCU.util.template.getTemplate", function() {
	it("it produces a Handlebars template of the returned data", function() {
<<<<<<< HEAD
		expect(AQCU.util.template.getTemplate("seleaaact-sites")).toBeDefined();
=======
		expect(AQCU.util.template.getTemplate("seleaaact-sites")).toBeDefined(); //TODO actually test the resolution of the promise
>>>>>>> 8fef2059ccdc1d5adfcfab3c6b02f98498d6d1d3
	});
});