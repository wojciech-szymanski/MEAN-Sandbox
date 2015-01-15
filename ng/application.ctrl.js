angular.module("app")
.controller("ApplicationCtrl", function ($scope, UserSvc) {

	$scope.$on("login", function (_, user) {
		$scope.currentUser = user;
	});

	$scope.logout = function () {
		$scope.currentUser = "";
		UserSvc.logout();
	};

	if (typeof window.localStorage.token !== "undefined" && window.localStorage.token !== "") {
		UserSvc.getUser(window.localStorage.token)
			.then(function (user) {
				$scope.currentUser = user.data;
			});
	}
});