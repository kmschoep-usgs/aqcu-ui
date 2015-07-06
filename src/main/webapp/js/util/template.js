/**
 * Utility functions and attributes to help retrieve and process templates.
 */
AQCU.util.template = function() {
	return {
		templateBasePath: "templates",
		getTemplate: function(conf) {
			var template = conf.template;
			var context = conf.context;
			var deferredTemplate = $.Deferred();
			$.ajax({
				url : AQCU.util.template.templateBasePath + "/" + template + '.html',
				success : function(html) {
					deferredTemplate.resolveWith(context, [Handlebars.compile(html)]);
				},
				error : function() {
					deferredTemplate.resolveWith(context, [Handlebars.compile('Unable to load template')]);
				}
			});
			
			return deferredTemplate;
		}
	};
}();