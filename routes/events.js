/*
 * Serve JSON to our AngularJS client
 */

var http = require('./http');

// constants
var EVENTS = "events";

// error messages
var error = {
    "graph": "Missing Site/env params :site = us & env=production",
    "event": "Missing id and/or env=production",
    "future": "Missing Site/env params :site = us & env = production & future = no of days",
};

var channelEnum = {
    "rtm": 1,
    "nume": 2,
    "web": 3,
    "mobile": 4,
    "keyflow": 5,
    "trafficdriver":6,
    "internetmarketing":7
};


exports.getIndexStatus = function(req, res) {
    // options
    var opts = {};
    opts.query = {};
    var env = req.query.env;

    if (!req.query.id || !env) {
        res.json(error.event);
        return;
    }
    opts.query.id = req.query.id;
    opts.path = EVENTS + "/diag";

    if (req.query.classify)
        opts.query.classify = true;

    return http.httpGet(opts, req)
        .then(function(resp) {
            var output = JSON.parse(resp.text);
            var result = {};
            result.itemCountDB = output.diagnosticInfo.debugInfo[req.query.id].itemCountDB;
            result.itemCountFIS = output.diagnosticInfo.debugInfo[req.query.id].itemCountFIS;
            result.staleItemIds = output.diagnosticInfo.debugInfo[req.query.id].staleItemIds;
            res.json(result);

        }, function(error) {
            console.log(error);
        });
};

exports.forceDelete = function(req, res) {
    // options
    var opts = {};
    opts.query = {};
    var env = req.query.env;

    if (!req.query.id || !env) {
        res.json(error.event);
        return;
    }
  
   opts.path = EVENTS + "/" + req.query.id +"/" + "reclassifydeleteditems";

   opts.query.forceReclassify = true;
   opts.query.fullLogs= true;

    return http.httpGet(opts, req)
        .then(function(resp) {
            res.json(JSON.parse(resp.text));

        }, function(error) {
            console.log(error);
        });
};

exports.getEvent = function(req, res) {
    // options
    var opts = {};
    opts.query = {};
    var env = req.query.env;

    if (!req.query.id || !env) {
        res.send(400,error.event);
        return;
    }

    opts.path = EVENTS + "/" + req.query.id;

    return http.httpGet(opts, req)
        .then(function(resp) {
            try{
                res.json(JSON.parse(resp.text));
            }
            catch(err){
                res.send(400,err);
            }
           

        }, function(error) {
             res.send(400,error);
        });
};

exports.getEvents = function(req, res) {
    var site = req.query.site;
    var env = req.query.env;
    var fetchSize = req.query.fetchSize;
    var pageNo = req.query.pageNo;
    var sortField = req.query.sortField;
    var sortOrder = req.query.sortOrder;
    var active = req.query.active;
    var future = req.query.future;
    var channel = req.query.channel;
    var state = req.query.state;
    var startDate = req.query.startDate;
    var curationId = req.query.curationId;

    if (!site || !env) {
        res.json(error.graph);
        return;
    }


    // options
    var opts = {};
    opts.query = {};

    opts.path = EVENTS;
    opts.query.fetchSize = fetchSize ? fetchSize : 10;
    opts.query.pageNo = pageNo ? pageNo : 10;
    opts.query.sortField = sortField ? sortField : "id";
    opts.query.sortOrder = sortOrder ? sortOrder : "desc";

    if (active == "true")
        opts.query.active = true;
    else if (active == "false")
        opts.query.active = false;
    else
        delete opts.query.active;

    if(state){
        state =='live' ? opts.query.startsBefore = opts.query.endsAfter = parseInt(new Date().getTime()) : null;
        state == 'end' ? opts.query.endsBefore = parseInt(new Date().getTime()) : null;
    }

    if(channel)
        opts.query.channels = '[' + channelEnum[channel.toLowerCase()] + ']';

    if (future != null || future != undefined) {
        var futureDate = new Date();
        opts.query.startsBefore = opts.query.endsAfter = futureDate.setDate(futureDate.getDate() + future);
    }

    if(startDate)
        opts.query.startsBefore = opts.query.endsAfter = startDate;

    if(curationId)
        opts.query.curationId = curationId;

    http.httpGet(opts, req)
        .then(function(resp) {
            
            var jsonResp = JSON.parse(resp.text);
            var events = [];


            for(var i in jsonResp.events){
                var event = jsonResp.events[i];
                var temp = {};
                temp.id = event.id;
                temp.name = event.name;
                temp.active = event.active;
                temp.user = event.user;
                temp.curationId = event.curationId;
                events.push(temp);
            }

            jsonResp.events = events;
            res.json(jsonResp);

        }, function(error) {
            res.send(400,error);
        });
};

exports.getFutures = function(req, res) {
    var site = req.query.site;
    var env = req.query.env;
    var future = req.query.future;

    if (!site || !env || future == undefined) {
        res.json(error.future);
        return;
    }

    // options
    var opts = {};
    opts.path = EVENTS;
    opts.query = {};
    opts.query.fetchSize = 1;
    opts.query.sortField = "id";

    var ajaxReqCounter = 0;
    var futureEvents = [];

    for (var i = 1; i <= future; i++) {
        var futureDate = new Date();
        opts.query.startsBefore = opts.query.endsAfter = futureDate.setDate(futureDate.getDate() + i);

        (function(a) {
            var futureEvent = {};
            futureEvent[a.getTime()] = 0;
            futureEvents.push(futureEvent);

            http.httpGet(opts, req).then(function(success) {
                var jsonResp = JSON.parse(success.text);
                futureEvent[a.getTime()] = jsonResp.totalCount;
                ajaxReqCounter++;

                if (ajaxReqCounter == future) {
                    res.json(futureEvents);
                }

            }, function(failure) {
                ajaxReqCounter++;

                if (ajaxReqCounter == future)
                    res.json(futureEvents);
            });
        })(futureDate);
    }
}


exports.getChannel = function(req, res) {
    var site = req.query.site;
    var env = req.query.env;
    if (!site || !env) {
        res.json(error.graph);
        return;
    }

    // options
    var opts = {};
    opts.path = EVENTS;
    opts.query = {};
    opts.query.fetchSize = 1;

    // RTM
    opts.query.channels = '[' + channelEnum["rtm"] + ']';
    // output
    var channels = {};

    // make REST call
    return http.httpGet(opts, req)
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.rtm = {};
            channels.rtm.count = jsonResp.totalCount;

            // NUME
            opts.query.channels = '[' + channelEnum["nume"] + ']';
            return http.httpGet(opts, req);

        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.nume = {};
            channels.nume.count = jsonResp.totalCount;

            // WEB
            opts.query.channels = '[' + channelEnum["web"] + ']';
            return http.httpGet(opts, req);
        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.web = {};
            channels.web.count = jsonResp.totalCount;

            // mobile
            opts.query.channels = '[' + channelEnum["mobile"] + ']';
            return http.httpGet(opts, req);
        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.mobile = {};
            channels.mobile.count = jsonResp.totalCount;

            // keyflow
            opts.query.channels = '[' + channelEnum["keyflow"] + ']';
            return http.httpGet(opts, req);
        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.keyflow = {};
            channels.keyflow.count = jsonResp.totalCount;

            // trafficdriver
            opts.query.channels = '[' + channelEnum["trafficdriver"] + ']';
            return http.httpGet(opts, req);
        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.trafficdriver = {};
            channels.trafficdriver.count = jsonResp.totalCount;

            // internetmarketing
            opts.query.channels = '[' + channelEnum["internetmarketing"] + ']';
            return http.httpGet(opts, req);
        }, function(error) {
            res.send(400,error);
        })
        .then(function(success) {
            var jsonResp = JSON.parse(success.text);
            channels.internetmarketing = {};
            channels.internetmarketing.count = jsonResp.totalCount;
            res.json(channels);
        }, function(error) {
            res.send(400,error);
        });
}



exports.getEventsGraph = function(req, res) {
    var site = req.query.site;
    var env = req.query.env;


    if (!site || !env) {
        res.json(error.graph);
        return;
    }


    // options
    var opts = {};
    opts.query = {};

    opts.path = EVENTS;
    opts.query.fetchSize = 1;
    opts.query.active = true;

    var pieChartData = {};

    opts.query.startsBefore = opts.query.endsAfter = parseInt(new Date().getTime());
    http.httpGet(opts, req)
    .then(function(resp) {
        var jsonResp = JSON.parse(resp.text);
        pieChartData.live = {};
        pieChartData.live.count = jsonResp.totalCount;

        // completed events
        delete opts.query.startsBefore;
        delete opts.query.endsAfter;
        opts.query.endsBefore = parseInt(new Date().getTime());
        return http.httpGet(opts, req);

    }, function(error) {
        res.send(400,error);
    })
    .then(function(resp) {
        var jsonResp = JSON.parse(resp.text);
        pieChartData.end = {};
        pieChartData.end.count = jsonResp.totalCount;

        // return response
        res.json(pieChartData);

    }, function(error) {
        res.send(400,error);
    })
};
