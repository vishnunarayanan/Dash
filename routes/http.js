var superagent = require('superagent');
var Q = require('q');

var URLS = {
    "production": "http://www.ebay.com",
    "preproduction": "http://www.rps.pp.stratus.ebay.com",
    "staging":"http://www.rps.stg.stratus.qa.ebay.com"
};

var siteEnum = {
    "us": 0,
    "uk": 3,
    "de": 77
};

exports.httpGet = function(opts, req) {

    var env = req.query.env ? req.query.env : "production";
    var url = URLS[env];

    opts.url = url + opts.path;

    if (req.query.site)
        opts.query.siteId = siteEnum[req.query.site];

    var deferred = Q.defer();
    var agent = superagent.agent();

    // console.log(req.ip);
    // console.log(opts);
    agent.get(opts.url)
        .query(opts.query)
        .end(function(res) {
            if (res.ok) {
                deferred.resolve(res);
            } else {
                deferred.reject(res.text);
            }
        });
    return deferred.promise;
};
