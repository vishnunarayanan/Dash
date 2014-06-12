angular.module('dashApp').controller('ChannelCtrl', function($routeParams, $scope, Restangular, Data) {

    var eventsHandle = Restangular.all('events/channels');
    var query = {
        site: $routeParams.site,
        env: $routeParams.env
    };

    $scope.shared = Data;
    $scope.state = {};
    $scope.heading = "Channels";


    $scope.$watch('state.selected', function(n, o) {
        $scope.shared.channel = n;
    });

    $scope.loading = true;
    eventsHandle.getList(query).then(function(resp) {
        $scope.loading = false;
        var data = resp[0];
        $scope.chart = {
            "type": "AreaChart",
            "displayed": true,
            "data": {
                "cols": [{
                    "id": "channel",
                    "label": "Channels",
                    "type": "string"
                }, {
                    "id": "type",
                    "label": "Event Count",
                    "type": "number"
                }],
                "rows": [{
                    "c": [{
                        "v": "RTM"
                    }, {
                        "v": data.rtm ? data.rtm.count : "error"
                    }]
                }, {
                    "c": [{
                        "v": "NUME"
                    }, {
                        "v": data.num ? data.nume.count : "error"
                    }]
                }, {
                    "c": [{
                        "v": "Web"
                    }, {
                        "v": data.web ? data.web.count : "error"
                    }]
                }, {
                    "c": [{
                        "v": "Mobile"
                    }, {
                        "v": data.mobile ? data.mobile.count : "error"
                    }]
                }, {
                    "c": [{
                        "v": "KeyFlow"
                    }, {
                        "v": data.keyflow ? data.keyflow.count : "error"
                    }]
                },{
                    "c": [{
                        "v": "trafficdriver"
                    }, {
                        "v": data.trafficdriver ? data.trafficdriver.count : "error"
                    }]
                },{
                    "c": [{
                        "v": "internetmarketing"
                    }, {
                        "v": data.internetmarketing ? data.internetmarketing.count : "error"
                    }]
                }
                ]
            },
            "options": {
                // "chartArea":{width:"70%",height:"70%"},
                "colors": ['#FF9900'],
                "vAxis": {
                    "title": "No of Events",
                    "gridlines": {
                        "count": 5
                    }
                },
                "hAxis": {
                    "title": "Channels"
                }
            }
        };
    }, function(error) {
        $scope.loading = false;
        $scope.error = error.data;
    });
});
