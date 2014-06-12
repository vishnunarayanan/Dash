angular.module('dashApp').factory('Data', function($rootScope) {
	var shared = {};
	shared.state = "";
	shared.eventId = "";
	shared.channel ="";
	shared.future="";
	shared.curation = "";


	shared.links = {};
	shared.links.production = {}; shared.links.production.us = {}; shared.links.production.uk = {}; shared.links.production.de = {};
	shared.links.preproduction = {}; shared.links.preproduction.us = {}; shared.links.preproduction.uk = {}; shared.links.preproduction.de = {};
	shared.links.staging = {}; shared.links.staging.us = {}; shared.links.staging.uk = {}; shared.links.staging.de = {};


	shared.links.production.us.event = "http://www.ebay.com/rpt/edit-event?eventId=";
	shared.links.production.uk.event = "http://www.ebay.co.uk/rpt/edit-event?eventId=";
	shared.links.production.de.event = "http://www.ebay.de/rpt/edit-event?eventId=";
	shared.links.production.us.curation = "http://www.ebay.com/rpt/customize?icId=";
	shared.links.production.uk.curation = "http://www.ebay.co.uk/rpt/customize?icId=";
	shared.links.production.de.curation = "http://www.ebay.de/rpt/customize?icId=";


	shared.links.preproduction.us.event = "http://www.latest.pp.stratus.ebay.com/rpt/edit-event?eventId=";
	shared.links.preproduction.uk.event = "http://www.uk.latest.pp.stratus.ebay.com/rpt/edit-event?eventId=";
	shared.links.preproduction.de.event = "http://www.de.latest.pp.stratus.ebay.com/rpt/edit-event?eventId=";
	shared.links.preproduction.us.curation = "http://www.latest.pp.stratus.ebay.com/rpt/customize?icId=";
	shared.links.preproduction.uk.curation = "http://www.uk.latest.pp.stratus.ebay.com/rpt/customize?icId=";
	shared.links.preproduction.de.curation = "http://www.de.latest.pp.stratus.ebay.com/rpt/customize?icId=";

	shared.links.staging.us.event = "http://www.paradise.stratus.qa.ebay.com/rpt/edit-event?eventId=";
	shared.links.staging.uk.event = "http://www.uk.paradise.stratus.qa.ebay.com/rpt/edit-event?eventId=";
	shared.links.staging.de.event = "http://www.de.paradise.stratus.qa.ebay.com/rpt/edit-event?eventId=";
	shared.links.staging.us.curation = "http://www.paradise.stratus.qa.ebay.com/rpt/customize?icId=";
	shared.links.staging.uk.curation = "http://www.uk.paradise.stratus.qa.ebay.com/rpt/customize?icId=";
	shared.links.staging.de.curation = "http://www.de.paradise.stratus.qa.ebay.com/rpt/customize?icId=";



	shared.links.preproduction.event = "http://www.rps.pp.stratus.ebay.com/rps/";
	shared.links.staging.event = "http://www.rps.stg.stratus.qa.ebay.com/rps/";

	shared.links.production.metrics = "http://rpp-dashboard-32395.phx-os1.stratus.dev.ebay.com:8080/v1/rpp/events/metrics/show?eventId=";
	shared.links.production.mapItms = "http://stf-agg-phx-001.vip.ebay.com:9090/query?Vr=0.1&Qy=AND(EQ(ATTR(rpp_cid),NAME({{event.id}})), EQ(ATTR(4128),2))&Fl=ItemID&Hx=no&Nr=1000";
	shared.links.production.nonBopis = "http://stf-agg-phx-001.vip.ebay.com:9090/query?Vr=0.1&Qy=AND(EQ(ATTR(rpp_cid),NAME({{event.id}})), NE(ATTR(8809),2))&Fl=ItemID&Hx=no&Nr=1000";


	shared.token = "?token=HRxqadtL5enOUjsbEbBZyK5tcbQn3NezX2dFpPi315mqQzLvi0i9%2BRWf5SryKuUi||AQAAAUEOgMsV";


	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		 // console.log(event);
	});
	return shared;
});