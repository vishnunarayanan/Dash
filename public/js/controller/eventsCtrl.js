var app = angular.module('dashApp').controller('EventsCtrl', function($routeParams, $scope, Restangular, $filter, ngTableParams, Data, $location) {

    // init
    $scope.html = "/template/events.html";
    $scope.shared = Data;
    $scope.prefix = "All";
    $scope.heading = "Events";
    $scope.eventLink = Data.links[$routeParams.env][$routeParams.site]['event'];
    $scope.curationLink = Data.links[$routeParams.env][$routeParams.site]['curation'];
    $scope.shared.event = "";

    $scope.clear = function() {
        clearSelected();
        if ($scope.prefix != "All") {
            $scope.prefix = "All";
            refresh();
        }
        $scope.tableParams.filter = "";
    }

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        total: 10, // value less than count hide pagination
        count: 10,
        filter: ""
    });

    // watch for changes of parameters
    var data;
    $scope.$watch('tableParams', function(params) {
        redraw(params);
    }, true);

    // watch for live/end event clicks.
    $scope.$watch('shared.state', function(param, old) {
        if (old == param)
            return;

        $scope.prefix = param ? param : "All";
        param = param.toLowerCase();
        query.state = param;
        refresh();
    });

    // watch for curation clicks.
    $scope.$watch('shared.curationId', function(param, old) {
        if (old == param)
            return;

        $scope.prefix = param ? param : "All";
        if (param) {
            $scope.curationId = param;
            query.curationId = param;
        } else {
            $scope.shared.event = "";
        }
        refresh();
    });


    // watch for channel clicks
    $scope.$watch('shared.channel', function(param, old) {
        if (old == param)
            return;

        $scope.prefix = param ? param : "All";
        param = param.toLowerCase();
        query.channel = param;
        refresh();
    });
    // watch for upcoming events clicks
    $scope.$watch('shared.future', function(param, old) {
        if (old == param)
            return;

        $scope.prefix = param ? param : "All";
        param = param.replace(/-/g, ' ') + " " + new Date().getFullYear();
        param = new Date(param).getTime();

        if (isNaN(param))
            query.state = "All";
        else
            query.startDate = param;
        refresh();
    });


    function refresh(a) {
        $scope.loading = true;
        delete $scope.error;
        // delete $scope.events;
        
        eventsHandle.getList(query).then(function(resp) {
            data = resp[0].events;
            redraw($scope.tableParams);
            $scope.loading = false;
        }, function(error) {
            data = undefined;
            redraw($scope.tableParams);
            $scope.loading = false;
            $scope.error = error.data;
        });

        delete query.state;
        delete query.channel;
        delete query.startDate;
        delete query.curationId;
    }

    function redraw(params) {
        // if (!data)
        //     return;

        var orderedData = (params && params.filter) ?
            $filter('filter')(data, params.filter) :
            data;

        if(!orderedData)
            orderedData = [];

        // set total for recalc pagination
        params.total = orderedData.length;

        // slice array data on pages
        $scope.events = orderedData.slice(
            (params.page - 1) * params.count,
            params.page * params.count
        );

        if ($scope.events.length == 0 && orderedData.length > 0) {
            $scope.events = orderedData.slice(0, params.count);
        }
    }

    // row select
    $scope.select = function(row) {
        clearSelected();
        row.selected = true;
        $scope.shared.event = row;
    }

    function clearSelected() {
        for (var i in $scope.events)
            $scope.events[i].selected = false;
        $scope.shared.event = "";
    }

    // initial data load.
    var eventsHandle = Restangular.all('events');
    var query = {
        pageNo: 1,
        fetchSize: 500,
        site: $routeParams.site,
        env: $routeParams.env
    };
    refresh();
});
