angular.module("app")
.service("UserSvc", function ($http) {

	var svc = this;

	svc.getUser = function (token) {
		$http.defaults.headers.common["X-Auth"] = token;
		return $http.get("/api/users");
	}

	svc.login = function (username, password) {
		return $http.post("/api/sessions", {
			"username": username,
			"password": password
		}).then(function (val) {
			window.localStorage.token = val.data.token;
			return svc.getUser(val.data.token);
		});
	}

	svc.logout = function () {
		window.localStorage.token = "";
		$http.defaults.headers.common["X-Auth"] = "";
		return true;
	}

	svc.createUser = function (username, password) {
		return $http.post("/api/users", {
			"username": username,
			"password": password
		}).then(function () {
			return svc.login(username, password);
		});
	}
});