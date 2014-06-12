var app = angular.module('dashApp').controller('EventCtrl', function($scope, Restangular, $routeParams, Data) {
    $scope.shared = Data;

    $scope.eventId = $routeParams.eventId;
    $scope.metricLink = Data.links[$routeParams.env]['metrics'];
    $scope.isProd = $routeParams.env == "production" ? true : false;
    $scope.mapItms = Data.links[$routeParams.env]['mapItms'];
    $scope.nonBopis = Data.links[$routeParams.env]['nonBopis'];

    var eventHandle = Restangular.all('event');
    var curationHandle = Restangular.all('curation');
    var ivfHandle = Restangular.all('curations/ivfstatus');
    var indexHandle = Restangular.all('event/indexstatus');
    var ivfForce = Restangular.all('curations/ivfforce');
    var forceDelete = Restangular.all('event/forcedelete');
   
    $scope.$watch('shared.event', function(n, o) {
        $scope.event = Data.event;
        $scope.show = Data.event ? true : false
        query.id = Data.event ? Data.event.id : undefined;
        $scope.loading = true;
        if (!$scope.event.curationId)
            return;
        fetch();
        
    });

    // SBE indexing 
    $scope.indexCount = ":-o";
    $scope.itemCount = "?";
    $scope.isCountNoMatch = false;
    $scope.isConflictIVF = false;

    // visibility
    $scope.visibility = ":-)";
    $scope.isIVFItemsShowing = true;
    $scope.conflictItemIds = "";

    $scope.forceClassify = function(elem) {
        elem.currentTarget.setAttribute("disabled", "disabled");
        elem.currentTarget.innerHTML = "Triggered";

        return indexHandle.getList({
            id: $scope.event.id,
            env: $routeParams.env,
            classify: true
        }).then(function(response) {
            console.log(response);
            var status = response[0];
            $scope.indexCount = status.itemCountFIS;

            if ($scope.indexCount != $scope.itemCount)
                $scope.isCountNoMatch = true;

            // stale item ids
            $scope.staleItemIds = status.staleItemIds;

        });
    };

    $scope.forceDelete = function(elem) {
        elem.currentTarget.setAttribute("disabled", "disabled");
        elem.currentTarget.innerHTML = "Triggered";

        return forceDelete.getList({
            id: $scope.event.id,
            env: $routeParams.env
        }).then(function(response) {
            console.log(response);
            $scope.conflictItemIds = "Refresh after few minutes...";

        });
    };

    $scope.forceIVF = function(elem) {
        elem.currentTarget.setAttribute("disabled", "disabled");
        elem.currentTarget.innerHTML = "Triggered";

        return ivfForce.getList({
            id: $scope.event.curationId,
            env: $routeParams.env
        }).then(function(response) {
            console.log(response);
            $scope.conflictItemIds = "Refresh after few minutes...";

        });
    };

    // initial event details
    // get event details
    var query = {
        env: $routeParams.env,
        id: $routeParams.eventId
    };

    function fetch() {
        if (!$scope.event)
            return;

        return eventHandle.getList(query).then(function(resp) {
            $scope.event = resp[0];

            // get curation details
            return curationHandle.getList({
                id: $scope.event.curationId,
                env: $routeParams.env
            });
        }).then(function(resp) {

            // curation result
            var curation = resp[0];
            $scope.itemCount = curation.curations[0].itemCount;
            $scope.hideItemsFromSearch = curation.curations[0].hideItemsFromSearch;

            if ($scope.hideItemsFromSearch) {
                $scope.visibility = "Hidden in SRP";
            } else {
                $scope.visibility = "Shown in SRP";
            }

            // get sbe index status
            return indexHandle.getList({
                id: $scope.event.id,
                env: $routeParams.env
            });
        }).then(function(resp) {

            // sbe index result
            var status = resp[0];
            $scope.indexCount = status.itemCountFIS ? status.itemCountFIS : 0;

            if ($scope.indexCount != $scope.itemCount)
                $scope.isCountNoMatch = true;

            // stale item ids
            $scope.staleItemIds = status.staleItemIds;

            $scope.loading = false;
            // get ivf status
            $scope.conflictItemIds = "Loading...";
            $scope.ivfloading = true;
            $scope.isConflictIVF = false;
            return ivfHandle.getList({
                id: $scope.event.curationId,
                env: $routeParams.env
            });
        }).then(function(resp) {
            // ivf status result
            $scope.ivfloading = false;
            var status = resp[0];
            if (status.invalidItemIds) {
                $scope.isConflictIVF = true;
                $scope.conflictItemIds = status.invalidItemIds;
            } else
                $scope.conflictItemIds = "No Conflict Items found";


        });
    }
});
