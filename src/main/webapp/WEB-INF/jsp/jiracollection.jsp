<%@page import="gov.usgs.aqcu.util.AqcuConfigurationLoaderSingleton"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%-- JIRA Issue Collector --%>
<script id="script-tag-jira-collection-url" type="text/javascript" src="<%=AqcuConfigurationLoaderSingleton.getProperty("aqcu.jira.collection")%>"></script>