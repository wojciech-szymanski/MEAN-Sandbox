angular.module("app")
.controller("RegisterCtrl", function ($scope, UserSvc) {

	$scope.createUser = function (username, password, confirm) {

		if (password !== confirm) {
			alert("Password does not match");
			return;
		}

		UserSvc.createUser(username, password)
			.then(function (response) {
				$scope.$emit("login", response.data);
			});
	}
});