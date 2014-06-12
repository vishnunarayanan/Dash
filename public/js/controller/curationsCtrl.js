var app = angular.module('dashApp').controller('CurationsCtrl', function($routeParams, $scope, Restangular, $filter, ngTableParams, Data) {

    $scope.shared = Data;

    $scope.heading = "Curations";
    $scope.html = "/template/curations.html";

    $scope.curationLink = Data.links[$routeParams.env][$routeParams.site]['curation'];

    var eventsHandle = Restangular.all('curations');
    var query = {
        pageNo: 1,
        fetchSize: 300,
        site: $routeParams.site,
        env: $routeParams.env
    };
    var data;

    $scope.clear = function() {
        clearSelected();
        $scope.shared.curationId ="";
        $scope.tableParams.filter = "";
    }

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        total: 10, // value less than count hide pagination
        count: 10,
        filter: ""
    });

    // watch for changes of parameters
    $scope.$watch('tableParams', function(params, old) {
        if (params == old)
            return;

        if (!data)
            return;

        var orderedData = params.filter ?
            $filter('filter')(data, params.filter) :
            data;

        // set total for recalc pagination
        params.total = orderedData.length;

        // slice array data on pages
        $scope.curations = orderedData.slice(
            (params.page - 1) * params.count,
            params.page * params.count
        );

    }, true);

    // row select
    $scope.select = function(row) {
        clearSelected();
        row.selected = true;
        $scope.shared.curationId = row.id;
    }

    function clearSelected() {
        for (var i in $scope.curations)
            $scope.curations[i].selected = false;
    }

    $scope.loading = true;
    // initial data load.
    eventsHandle.getList(query).then(function(resp) {
        data = resp[0].curations;
        var totalCount = resp[0].totalCount;
        $scope.tableParams.total = totalCount;
        $scope.loading = false;
    },function(error){
         $scope.loading = false;
         $scope.error = error.data;
    });



});
