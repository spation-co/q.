var app = angular.module("addApp", ["textsAdd", "services"]);
app.controller("addCtrl", function ($scope, $http, $window, lang, language) {
  $scope.texts = lang[language.getLanguage()];
  if (!$scope.texts) {
    $scope.texts = lang.en;
  }

  $scope.hasUserVerified = false;
  $scope.userAddress = "";
  $scope.streetName = "";
  $scope.zipCode = "";
  $scope.country = "";
  $scope.city = "";
  $scope.hints = [];
  $scope.buttonText = $scope.texts.ngbindingngscope;
  $scope.path = (address) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      address
    )}.json?types=address&access_token=pk.eyJ1IjoicXNwYXRpb24iLCJhIjoiY2s4MW85cm50MGJjdjNmbDkxZmtwY2ExbyJ9.qi-2tdukdDJhH7kZWttiRA`;
  };
  $scope.loading = false;
  $scope.coordinates = [];
  $scope.clear = () => {
    $scope.buttonText = $scope.texts.ngbindingngscope;
    $scope.streetName = "";
    $scope.zipCode = "";
    $scope.city = "";
    $scope.country = "";
    $scope.hasUserVerified = false;
    $scope.loading = false;
    $scope.coordinates = [];
    console.log("i'm clearing");
  };
  // function autocomplete(text, callback) {
  //       geocodingClient.geocoding.forwardGeocode({
  //           query: text,
  //           countries: ['It'],
  //           autocomplete: true,
  //           limit: 5,
  //       })
  //           .send()
  //           .then(response => {
  //               const match = response.body;
  //               callback(match);
  //           });
  //   }
  $scope.updateAddress = (hint) => {
    $scope.userAddress = hint.place_name;
    $scope.supermarket = hint.text;
    $scope.hints = [];
  };
  var submitAddress = () => {
    $scope.loading = true;
    $http
      .post("/", {
        data: {
          name: $scope.supermarket,
          address: $scope.userAddress,
          coordinates: $scope.coordinates,
        },
      })
      .then((res) => {
        $scope.isDataSent = true;
        $scope.loading = true;
        //$window.location.href = '/list';
      });
  };
  $scope.verifyAddress = async () => {
    if ($scope.hasUserVerified) {
      submitAddress();
      return;
    }
    $scope.userAddress = `${$scope.streetName}, ${$scope.zipCode}, ${$scope.city}, ${$scope.country}`;

    var res = await $http.get($scope.path($scope.userAddress));
    var features = res.data.features;
    $scope.loading = false;
    if (!features || features.length === 0) {
      $scope.clear();
      return;
    } //if geocoding fails we empty the fields
    features.sort((a, b) => {
      a.relevance < b.relevance ? 1 : -1;
    });
    // if (features[0] && features[0].relevance > 0.8 || $scope.hasUserVerified){} this is if we want to verify only uncertain cases
    $scope.coordinates = features[0].center;
    $scope.userAddress = features[0].place_name; //we change the data inserted by the user with the one got by mapbox geocoding. the aim is to establish consisten format in address
    $scope.$apply(() => {
      $scope.hasUserVerified = true;
    });
  };
  // $scope.getHints = function(e) {
  //   autocomplete($scope.userAddress, function (results) {
  //       $scope.hints = results.features;
  //   });
  // };
  // $scope.getAddress = async () => {
  //   if ($scope.buttonText === 'Avanti') {}
  //   $scope.loading = true;
  //   var res = await $http.get($scope.path($scope.userAddress));
  //   $scope.$apply(() => {$scope.buttonText = "Avanti";
  //   var features = res.data.features;
  //     $scope.loading = false;
  //     features.sort((a, b) => {
  //       a.relevance < b.relevance ? 1 : -1;
  //     });
  //     $scope.userAddress = features[0].place_name;
  //   });
  // };
});
