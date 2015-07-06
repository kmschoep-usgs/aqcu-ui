<%@page import="javax.naming.NamingException"%>
<%@page import="javax.naming.Context"%>
<%@page import="javax.naming.InitialContext"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
	Context ctx = new InitialContext();
	String jiraCollectionUrl;
	try {
		jiraCollectionUrl =  (String) ctx.lookup("java:comp/env/aqcu.jira.collection");
	} catch (NamingException ex) {
		jiraCollectionUrl = "";
	}
%>
<%-- JIRA Issue Collector --%>
<script id="script-tag-jira-collection-url" type="text/javascript" src="<%=jiraCollectionUrl%>"></script>