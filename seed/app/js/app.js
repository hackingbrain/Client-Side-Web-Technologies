/**
 * @author Sijie Liang
 * Note that I use lastname as the id in this assignment
 * Once the contact is saved, the lastname cannot be edited again.
 * Assume no person with same lastname
 */

(function () {
    "use strict";

    /* An array of US state abbreviations */

    const usStates = {
        AL: "ALABAMA",
        AK: "ALASKA",
        AS: "AMERICAN SAMOA",
        AZ: "ARIZONA",
        AR: "ARKANSAS",
        CA: "CALIFORNIA",
        CO: "COLORADO",
        CT: "CONNECTICUT",
        DE: "DELAWARE",
        DC: "DISTRICT OF COLUMBIA",
        FM: "FEDERATED STATES OF MICRONESIA",
        FL: "FLORIDA",
        GA: "GEORGIA",
        GU: "GUAM",
        HI: "HAWAII",
        ID: "IDAHO",
        IL: "ILLINOIS",
        IN: "INDIANA",
        IA: "IOWA",
        KS: "KANSAS",
        KY: "KENTUCKY",
        LA: "LOUISIANA",
        ME: "MAINE",
        MH: "MARSHALL ISLANDS",
        MD: "MARYLAND",
        MA: "MASSACHUSETTS",
        MI: "MICHIGAN",
        MN: "MINNESOTA",
        MS: "MISSISSIPPI",
        MO: "MISSOURI",
        MT: "MONTANA",
        NE: "NEBRASKA",
        NV: "NEVADA",
        NH: "NEW HAMPSHIRE",
        NJ: "NEW JERSEY",
        NM: "NEW MEXICO",
        NY: "NEW YORK",
        NC: "NORTH CAROLINA",
        ND: "NORTH DAKOTA",
        MP: "NORTHERN MARIANA ISLANDS",
        OH: "OHIO",
        OK: "OKLAHOMA",
        OR: "OREGON",
        PW: "PALAU",
        PA: "PENNSYLVANIA",
        PR: "PUERTO RICO",
        RI: "RHODE ISLAND",
        SC: "SOUTH CAROLINA",
        SD: "SOUTH DAKOTA",
        TN: "TENNESSEE",
        TX: "TEXAS",
        UT: "UTAH",
        VT: "VERMONT",
        VI: "VIRGIN ISLANDS",
        VA: "VIRGINIA",
        WA: "WASHINGTON",
        WV: "WEST VIRGINIA",
        WI: "WISCONSIN",
        WY: "WYOMING"
    };

    angular.module('contactApp', ['ngRoute', 'LocalStorageModule', 'ngMap'])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/contactList.html',
                controller: 'contactListController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            }).when('/contact/:id', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        })
        .directive('cswFileInput', function () {
            return {
                restrict: 'A',
                scope: {
                    data: '=fileData'
                },
                link: function (scope, element) {
                    element.on('change', function (domEvent) {
                        let reader = new FileReader();
                        reader.onload = function (fileReaderEvent) {
                            scope.$apply(function (scope) {
                                scope.data = fileReaderEvent.target.result;
                            });
                            angular.element(domEvent.target).val('');
                        };
                        reader.readAsDataURL(event.target.files[0]);
                    });
                }
            };
        })
        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('08724.hw5');
        })
        .controller('contactListController', function ($scope, localStorageService, $location) {
            $scope.clicked = function () {
                $location.path('/contact');
            }
            $scope.values = [];

            var lsKeys = localStorageService.keys();
            for (var i = 0; i < lsKeys.length; i++) {
                $scope.values.push(angular.copy(JSON.parse(localStorageService.get(lsKeys[i]))));
            }

            /*
             * Add a behavior to handle when the remove X is clicked
             */
            $scope.removeAddress = function (lastName) {

                for (var j = 0; j < lsKeys.length; j++) {
                    if ($scope.values[j].lastName === lastName) {
                        var index = $scope.values.indexOf($scope.values[j]);
                        $scope.values.splice(index, 1);
                        localStorageService.remove(lastName);
                        return;
                    }
                }
            };


            $scope.showContact = function (id) {
                $location.path('/contact/' + id);
            };
        })
        .controller('contactController', function ($scope, localStorageService, $routeParams, $location) {



            if (($routeParams.id) !== undefined) {

                $scope.address = {};
                var selectedid = $routeParams.id;
                var selecteditem = localStorageService.get(selectedid);
                $scope.address.firstName = (JSON.parse(selecteditem)).firstName;
                $scope.address.lastName = (JSON.parse(selecteditem)).lastName;
                $scope.address.email = (JSON.parse(selecteditem)).email;
                $scope.address.addr = (JSON.parse(selecteditem)).addr;
                $scope.address.phoneNumber = (JSON.parse(selecteditem)).phoneNumber;
                $scope.address.city = (JSON.parse(selecteditem)).city;
                $scope.address.state = (JSON.parse(selecteditem)).state;
                $scope.address.zip = (JSON.parse(selecteditem)).zip;
                $scope.address.files = (JSON.parse(selecteditem)).files;

                $scope.isDisable = function(){
                    return true;
                }
            } else {
                console.log(" ID is undefined");
            }


            $scope.stateOptions = usStates;

            /*
             * Add a behavior to handle when Add is clicked.
             */
            $scope.saved = function () {

                localStorageService.set($scope.address.lastName, JSON.stringify($scope.address));

                /*
                 * Reset values on the model. Notice how the UI updates!
                 */
                $scope.address = {};
                $location.path('/');
            }
        });

})();