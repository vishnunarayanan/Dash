angular.module('dashApp').controller('FutureEventCtrl', function($routeParams, $scope, Restangular, Data) {

    var eventsHandle = Restangular.all('events/futures');
    var query = {
        site: $routeParams.site,
        env: $routeParams.env,
        future: 7,
        pageNo: 1,
        fetchSize: 300
    };

    $scope.shared = Data;
    $scope.state = {};

    $scope.loading = true;
    $scope.heading = "Upcoming Events";

    $scope.$watch('state.selected', function(newVal, oldVal) {
        if(newVal == oldVal)
            return;

        $scope.shared.future = newVal;
    });

    eventsHandle.getList(query).then(function(resp) {
        $scope.loading = false;
        var data = resp[0];

        $scope.chart = {
            "click": true,
            "type": "BarChart",
            "displayed": true,
            "data": {
                "cols": [{
                    "id": "month",
                    "label": "Month",
                    "type": "string"
                }, {
                    "id": "event",
                    "label": "Up-Coming Events",
                    "type": "number"
                }],
                "rows": []
            },
            "options": {
                "chartArea": {
                    "width": "65%",
                    "height": "75%"
                },
                "vAxis": {
                    "title": "Date",
                    "gridlines": {
                        "count": 3
                    }
                },
                "hAxis": {
                    "title": "No of Events"
                }
            },
        };
        $.each(data, function(key, val) {
            $.each(val, function(k, v) {
                var row = {
                    "c": [{
                        "v": new Date(parseInt(k)).customFormat("#DDD#-#D#-#MMM#")
                    }, {
                        "v": v
                    }]
                };

                $scope.chart.data.rows.push(row);
            });
        });
    });
});
