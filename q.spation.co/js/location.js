var app = angular.module("locApp", ["ngCookies", "textsLocation", "services"]);
app.controller("locCtrl", function (
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

  $scope.userAddress = "";
  $scope.streetName = "";
  $scope.zipCode = "";
  $scope.country = "";
  $scope.city = "";
  $scope.buttonText = "Conferma";
  $scope.path = (address) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      address
    )}.json?types=address&access_token=pk.eyJ1IjoicXNwYXRpb24iLCJhIjoiY2s4MW85cm50MGJjdjNmbDkxZmtwY2ExbyJ9.qi-2tdukdDJhH7kZWttiRA`;
  };
  $scope.loading = false;
  $scope.clear = () => {
    $scope.buttonText = "Conferma";
    $scope.streetName = "";
    $scope.zipCode = "";
    $scope.city = "";
    $scope.country = "";
    $scope.shouldUserVerify = false;
  };
  $scope.getAddress = async () => {
    $scope.userAddress = `${$scope.streetName}, ${$scope.zipCode}, ${$scope.city}, ${$scope.country}`;

    $scope.loading = true;
    var res = await $http.get($scope.path($scope.userAddress));
    $scope.$apply(() => {
      var features = res.data.features;
      $scope.loading = false;
      features.sort((a, b) => {
        a.relevance < b.relevance ? 1 : -1;
      });
      if (
        (features[0] && features[0].relevance > 0.8) ||
        $scope.shouldUserVerify
      ) {
        $scope.userAddress = features[0].place_name;
        var date = new Date();
        if ($scope.doesAgree) {
          date.setMonth(date.getMonth() + 3);
          $cookies.put("qspationUserAddress", $scope.userAddress, {
            expires: date.toUTCString(),
          });
        } else {
          $cookies.remove("qspationUserAddress");
          sessionStorage.setItem("qspationUserAddress", $scope.userAddress);
        }
        $window.location.href = "/list";
      } else {
        $scope.userAddress = features[0].place_name;
        $scope.shouldUserVerify = true;
      }
    });
  };
});
