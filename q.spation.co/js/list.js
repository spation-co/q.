var app = angular.module("listApp", ["ngCookies", "textsList", "services"]);
app.directive("slider", function () {
  return {
    restrict: "EA",
    link: function (scope, element) {
      element.on("mousedown", () => {
        scope.$apply(function () {
          scope.width = element[0].getBoundingClientRect().width;
          scope.startX = element[0].getBoundingClientRect().left;
          scope.isMouseClicked = true;
          scope.showDistance = true;
        });
      });
      element.on("mousemove", (e) => {
        scope.$apply(function () {
          scope.maxDistanceReached = false;
          if (
            scope.isMouseClicked &&
            scope.maxDistance <= 50 &&
            scope.maxDistance >= 0
          ) {
            const left = ((e.pageX - scope.startX) * 100) / scope.width;
            if (left > 101 || left < 0 || !element[0].firstElementChild) return;
            element[0].firstElementChild.style.left = left + "%";
            scope.maxDistance = parseInt(left / 2);
          }
        });
      });
      element.on("mouseup", (e) => {
        scope.$apply(function () {
          scope.isMouseClicked = false;
          scope.showDistance = false;
        });
      });
      element.on("touchstart", () => {
        scope.$apply(function () {
          scope.width = element[0].getBoundingClientRect().width;
          scope.startX = element[0].getBoundingClientRect().left;
          scope.isMouseClicked = true;
          scope.showDistance = true;
        });
      });
      element.on("touchmove", (e) => {
        scope.$apply(function () {
          scope.maxDistanceReached = false;
          if (
            scope.isMouseClicked &&
            scope.maxDistance <= 50 &&
            scope.maxDistance >= 0
          ) {
            var left;
            if (e.pageX) {
              left = ((e.pageX - scope.startX) * 100) / scope.width;
            } else {
              left =
                ((e.changedTouches[0].pageX - scope.startX) * 100) /
                scope.width;
            }
            if (left > 101 || left < 0 || !element[0].firstElementChild) return;
            element[0].firstElementChild.style.left = left + "%";
            scope.maxDistance = parseInt(left / 2);
          }
        });
      });
      element.on("touchend", (e) => {
        scope.$apply(function () {
          scope.isMouseClicked = false;
          scope.showDistance = false;
        });
      });
    },
  };
});
app.controller("listCtrl", function (
  $scope,
  $http,
  $cookies,
  $window,
  lang,
  language
) {
  $scope.texts = lang[language.getLanguage()];
  if (!$scope.texts) {
    $scope.texts = lang.en;
  }

  var location = $cookies.get("qspationUserAddress");
  if (location) {
    $scope.userAddress = location;
  } else if (sessionStorage.getItem("qspationUserAddress")) {
    $scope.userAddress = sessionStorage.getItem("qspationUserAddress");
  } else {
    $window.location.href = "/location";
  }
  $scope.maxDistance = 5;
  $scope.showResults = false;
  $scope.last = 5;
  $scope.supermarkets = [];
  $scope.distances = [];
  $scope.maxDistanceReached = false;

  $scope.distance = (p1, p2) => {
    const r = 6371;
    const h1 = Math.sin(((p1[0] - p2[0]) * Math.PI) / 360);
    const h2 = Math.sin(((p1[1] - p2[1]) * Math.PI) / 360);
    const inner = h2 * h2 + Math.cos((p1[1] * Math.PI) / 180) * Math.cos((p2[1] * Math.PI) / 180) * h1 * h1;
    return parseInt(2 * r * Math.asin(Math.sqrt(inner)) * 100) / 100;
  };
  $scope.path = (address) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      address
    )}.json?types=address&access_token=pk.eyJ1IjoicXNwYXRpb24iLCJhIjoiY2s4MW85cm50MGJjdjNmbDkxZmtwY2ExbyJ9.qi-2tdukdDJhH7kZWttiRA`;
  };

  var getAverage = (arr) => {
    var sum = 0,
      len = 0;
    arr.forEach((item) => {
      if (typeof item === "number") {
        sum += item;
        len++;
      }
    });
    return len === 0 ? 1 : parseInt(sum / len); //se il vettore è inizialmente vuoto assumiamo come processing time 1 minuto
  };
  $scope.getNext = () => {
    var count = 0;
    while (
      count < 5 &&
      $scope.supermarkets[$scope.last + count].distance < $scope.maxDistance
    ) {
      count++;
    }
    $scope.last += 5;

    if (count < 5 || $scope.last === $scope.supermarkets.length) {
      $scope.maxDistanceReached = true;
    }
  };
  $scope.getNearest = async () => {
    var res = await $http.get($scope.path($scope.userAddress));

    var features = res.data.features;

    features.sort((a, b) => {
      a.relevance < b.relevance ? 1 : -1;
    });
    var coor = features[0].center;
    var D,
      date = new Date(),
      hrs = date.getHours();

    $scope.supermarkets.forEach((item, index) => {
      D = $scope.distance(coor, item.coordinates);
      $scope.supermarkets[index].distance = D;

      var str = (item.workingHours && item.workingHours.split("-")) || [
        "8",
        "20",
      ];

      $scope.supermarkets[index].pTime =
        getAverage(item.processingTime) * item.people;
      $scope.supermarkets[index].isClosed =
        hrs < parseInt(str[0].split(":")[0].trim()) &&
        hrs > parseInt(str[1].split(":")[0].trim());
      var isUptoDate = date.getTime() - new Date(item.lastupdate).getTime();
      $scope.supermarkets[index].updateTime = isNaN(isUptoDate)
        ? false
        : parseInt(isUptoDate / 60000);
      $scope.supermarkets[index].isUptoDate = isNaN(isUptoDate)
        ? false
        : isUptoDate < 2700000;
    });
    $scope.updateDistance = () => {};
    $scope.supermarkets.sort((a, b) => {
      return a.distance - b.distance;
    });

    $scope.$apply(() => {
      $scope.showResults = true;
    });
  };

  $http
    .get("/supermarkets")
    .then(function (response) {
      $scope.supermarkets = response.data;
      $scope.getNearest();
    })
    .catch((err) => {});
});
