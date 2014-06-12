var http = require('./http');

// constants
var CURATIONS = "curations";
var DIAG = "diagivf";
var IVF = "ivf";

// error messages
var error = {
    "curations": "Missing Site/env params :site = us & env=production",
    "curation": "Missing id"
};


exports.getCuration = function(req, res) {
    // options
    var opts = {};
    opts.query = {};
    var env = req.query.env;

    opts.query.fetchItemCount = true;
    opts.query.ids = new Array;
    opts.query.ids.push(req.query.id);

    var arrStr = opts.query.ids.toString();
    arrStr = '[' + arrStr + ']';
    opts.query.ids = arrStr;

    if (!req.query.id) {
        res.send(400, error.curation);
        return;
    }

    opts.path = CURATIONS;

    return http.httpGet(opts, req)
        .then(function(resp) {
            res.json(JSON.parse(resp.text));

        }, function(error) {
            res.json({
                'error': error
            });
        });
};

exports.getCurations = function(req, res) {
    var site = req.query.site;
    var env = req.query.env;
    var fetchSize = req.query.fetchSize;
    var pageNo = req.query.pageNo;
    var sortField = req.query.sortField;
    var sortOrder = req.query.sortOrder;

    if (!site || !env) {
        res.json(error.graph);
        return;
    }

    // options
    var opts = {};
    opts.query = {};

    opts.path = CURATIONS;
    opts.query.fetchSize = fetchSize ? fetchSize : 10;
    opts.query.pageNo = pageNo ? pageNo : 10;
    opts.query.sortField = sortField ? sortField : "id";
    opts.query.sortOrder = sortOrder ? sortOrder : "desc";

    return http.httpGet(opts, req)
        .then(function(resp) {

            var jsonResp = JSON.parse(resp.text);
            var curations = [];

            for (var i in jsonResp.curations) {
                var curation = jsonResp.curations[i];
                var temp = {};
                temp.id = curation.id;
                temp.name = curation.name;
                temp.createdUser = curation.createdUser;
                temp.updatedUser = curation.updatedUser;
                curations.push(temp);
            }

            jsonResp.curations = curations;

            res.json(jsonResp);

        }, function(error) {
             res.send(400,error);
        });
};


exports.getVisibilityStatus = function(req, res) {
    var opts = {};
    var env = req.query.env;

    if (!req.query.id || !env) {
        res.json(error.curation);
        return;
    }

    opts.path = CURATIONS + "/" + req.query.id + "/" + DIAG;

    return http.httpGet(opts, req)
        .then(function(resp) {
            var jsonResp = JSON.parse(resp.text);

            var result = {};
            result.invalidItemIds = jsonResp.diagnosticInfo.debugInfo.ivfStatus.invalidItemIds;
            result.showInSRP = jsonResp.diagnosticInfo.debugInfo.ivfStatus.showInSRP;
            res.json(result);

        }, function(error) {
            res.json({
                'error': error
            });
        });
}

exports.forceIVF = function(req, res) {
    var opts = {};
    var env = req.query.env;

    if (!req.query.id || !env) {
        res.json(error.curation);
        return;
    }

    opts.path = CURATIONS + "/" + req.query.id + "/" + IVF;

    return http.httpGet(opts, req)
        .then(function(resp) {
            res.json({"success":"yes"});

        }, function(error) {
            res.json({
                'error': error
            });
        });
}

