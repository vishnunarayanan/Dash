angular.module('dashApp').controller('GraphCtrl', function($routeParams, $scope, Restangular, Data) {


    $scope.html = "/template/bar.html";

    var eventsHandle = Restangular.all('events/graph');
    var query = {
        site: $routeParams.site,
        env: $routeParams.env
    };

    $scope.shared = Data;

    $scope.state = {};

    $scope.loading = true;
    $scope.heading = "Events";

    eventsHandle.getList(query).then(function(resp) {
        $scope.loading = false;
        var data = resp[0];

        $scope.chart = {
            "click": true,
            "type": "PieChart",
            "displayed": true,
            "data": {
                "cols": [{
                    "id": "event",
                    "label": "Event Type",
                    "type": "string"
                }, {
                    "id": "type",
                    "label": "No Of Events",
                    "type": "number"
                }],
                "rows": [{
                    "c": [{
                        "v": "Live"
                    }, {
                        "v": data.live.count
                    }]
                }, {
                    "c": [{
                        "v": "End"
                    }, {
                        "v": data.end.count
                    }]
                }]
            },
            "options": {
                "chartArea": {
                    "width": "100%",
                    "height": "100%",
                    "left": 30,
                },
                "fontSize": 17,
                // "is3D" : true,
                "colors": ['#109618', '#DC3912'],
                "vAxis": {
                    "title": "Sales unit",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            }
        };

        $scope.$watch('state.selected', function(newVal, oldVal) {
           if(newVal == oldVal)
            return;

            if (newVal) {
                $scope.shared.state = newVal;
            } else {
                $scope.shared.state = "All";
            }
        });
    }, function(error) {
        $scope.loading = false;
        $scope.error = error.data;
    });
});
