var app = angular.module("updateApp", ["textsUpdate", "services"]);
app.controller("updateCtrl", async ($scope, $http, $window, lang, language) => {
  $scope.texts = lang[language.getLanguage()];
  if (!$scope.texts) {
    $scope.texts = lang.en;
  }

  $scope.id = $window.location.pathname.replace("/update/", "");
  $scope.people = "";

  $scope.isLastPerson = false;
  $scope.isEntering = true;
  $scope.startTime = "";

  $scope.userEntered = () => {
    $scope.isEntering = false;
  };
  $scope.changeIsLast = (val) => {
    $scope.isLastPerson = val;
  };
  $scope.updateNumber = (val) => {
    $scope.people = val;
  };

  $scope.submitNumberOfPeople = () => {
    if ($scope.isLastPerson) {
      $http.put("/" + $scope.id, {
        people: $scope.people,
        lastupdate: new Date(),
      });
    }
    $scope.startTime = Date.now();
    $scope.isEntering = false;
  };

  $scope.submitProcessingTime = () => {
    var endTime = Date.now();
    var diff = endTime - $scope.startTime;
    var pTime = diff / (($scope.people + 1) * 60000); //divide for 60000 to get minutes from milliseconds
    if (diff <= 60000) {
      $window.location.href = "/thanks";
      return;
    } //verify that processing time for each person is greater or equal to 1 minute, to avoid erroneus datas in db
    var points = $scope.userData.processingTime;
    if (!points) {
      points = [];
    }
    if (points.length < 10) {
      // if the datas are less than 10, just add the calculated value.No need to validate
      points.push(pTime); // if the existing data is updated as in this case
      $http.put("/" + $scope.id, { processingTime: points });
    } else {
      var sum = 0;
      points.forEach((val) => {
        sum += val;
      });
      var average = sum / points.length; // get the average of all processing times including the recent one
      diff = Math.abs(pTime - average);
      if (diff <= average) {
        points.shift(); // discard the first element
        points.push(pTime);
        $http.put("/" + $scope.id, { processingTime: points });
      }
    }
    $window.location.href = "/thanks";
  };
  $http
    .get("/" + $scope.id)
    .then(function (response) {
      $scope.userData = response.data;
    })
    .catch((err) => {});
});
