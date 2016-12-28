/**
 * Utility functions and attributes to help retrieve and process templates.
 */
AQCU.util.template = function() {
	var templateCache = {}; //private cache to hold templates which have already been retrieved.
	
	return {
		templateBasePath: "templates",
		getTemplate: function(conf) {
			var template = conf.template;
			var context = conf.context;
			var deferredTemplate = $.Deferred();
			if(templateCache[template]) {
				setTimeout(function() { deferredTemplate.resolveWith(context, [templateCache[template]]); }, 10);
			} else {
				$.ajax({
					url : AQCU.util.template.templateBasePath + "/" + template + '.html',
					success : function(html) {
						templateCache[template] = Handlebars.compile(html);
						deferredTemplate.resolveWith(context, [templateCache[template]]);
					},
					error : function() {
						deferredTemplate.resolveWith(context, [Handlebars.compile('Unable to load template')]);
					}
				});
			}
			
			return deferredTemplate;
		}
	};
}();