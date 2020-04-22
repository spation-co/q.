var app = angular.module("services", []);
app.factory("language", [
  "$window",
  ($window) => {
    return {
      getLanguage: () => {
        var language =
          $window.navigator.userLanguage || $window.navigator.language;
        console.log(language);
        switch (language) {
          case "it":
            language = "it";
            //console.log("language: italian");
            break;
          case "it-IT":
            language = "it";
            //console.log("language: italian");
            break;
          case "en":
            language = "en";
            //console.log("language: english");
            break;
          case "en-UK":
            language = "en";
            //console.log("language: english");
            break;
          case "fr":
            language = "fr";
            //console.log("language: french");
            break;
          case "fr-FR":
            language = "fr";
            //console.log("language: french");
            break;
          case "es":
            language = "es";
            //console.log("language: spanish");
            break;
          case "es-ES":
            language = "es";
            //console.log("language: spanish");
            break;
          default:
            language = "en";
          //console.log("language: deafault");
        }
        // $scope.texts = lang[language];
        // if (!$scope.texts) {
        // $scope.texts = lang.en;
        // }
        return language;
      },
    };
  },
]);
