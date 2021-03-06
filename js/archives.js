"use strict";
(function(angular) {
    angular.module("LeaderBoardApp", ["angularMoment", "ngAnimate", "ngCookies", "ngScrollable", "selectbox", "ui.router", "720kb.tooltips", "chart.js"]).config(configure);
    configure.$inject = ["$stateProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider", "tooltipsConfProvider", "ChartJsProvider"];

    function configure($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, tooltipsConfProvider, ChartJsProvider) {
        $urlRouterProvider.otherwise("/ladders");
        $stateProvider.state("root", {
            url: "?api&locale&loggedInPersonaId",
            templateUrl: "./Client/templates/archives/app.html",
            abstract: true
        }).state("root.persona", {
            url: "/personas/{personaId}",
            templateUrl: "./Client/templates/archives/persona.html",
            controller: "personaCtrl",
            controllerAs: "vm",
            abstract: true
        }).state("root.persona.summary", {
            url: "?ladderId&graphTab&graphType",
            templateUrl: "./Client/templates/archives/persona-summary.html",
            controller: "personaSummaryCtrl",
            controllerAs: "vm",
            params: {
                graphTab: "faction",
                graphType: "single"
            }
        }).state("root.persona.matchHistory", {
            url: "/match-history",
            templateUrl: "./Client/templates/archives/persona-match-history.html",
            controller: "personaMatchHistoryCtrl",
            controllerAs: "vm"
        }).state("root.persona.matchDetails", {
            url: "/match-details/{matchId}",
            templateUrl: "./Client/templates/archives/persona-match-details.html",
            controller: "personaMatchDetailsCtrl",
            controllerAs: "vm"
        }).state("root.persona.hallOfFame", {
            url: "/ascendency-wars?ladderType&category",
            templateUrl: "./Client/templates/archives/persona-hall-of-fame.html",
            controller: "personaHallOfFameCtrl",
            controllerAs: "vm",
            params: {
                category: "campaign_1"
            }
        }).state("root.ladders", {
            url: "/ladders/{gameType}/{category}/{ladderType}?viewType&matchId&personaId&filters&seasonId",
            templateUrl: "./Client/templates/archives/ladders.html",
            controller: "laddersCtrl",
            controllerAs: "vm"
        }).state("root.ladders_ladderType", {
            url: "/ladders?personaId",
            templateUrl: "./Client/templates/archives/ladders.html",
            controller: "laddersCtrl",
            controllerAs: "vm"
        }).state("root.ladders_gameType", {
            url: "/ladders/{gameType}?personaId",
            templateUrl: "./Client/templates/archives/ladders.html",
            controller: "laddersCtrl",
            controllerAs: "vm"
        }).state("root.ladders_category", {
            url: "/ladders/{gameType}/{category}?personaId",
            templateUrl: "./Client/templates/archives/ladders.html",
            controller: "laddersCtrl",
            controllerAs: "vm"
        }).state("root.replays", {
            url: "/replays?personaId",
            templateUrl: "./Client/templates/archives/replays.html",
            controller: "replaysCtrl",
            controllerAs: "vm"
        });
        tooltipsConfProvider.configure({
            smart: true
        });
        ChartJsProvider.setOptions({
            colors: ["rgba(151,187,205,1)", "rgba(220,220,220,1)", "rgba(247,70,74,1)", "rgba(70,191,189,1)", "rgba(253,180,92,1)", "rgba(148,159,177,1)", "rgba(77,83,96,1)"]
        })
    }
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position
        }
    }
    if (!Array.prototype.max) {
        Array.prototype.max = function(array) {
            return Math.max.apply(Math, array)
        }
    }
    if (!Array.prototype.min) {
        Array.prototype.min = function(array) {
            return Math.min.apply(Math, array)
        }
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fun) {
            "use strict";
            if (this === void 0 || this === null) {
                throw new TypeError
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") {
                throw new TypeError
            }
            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];
                    if (fun.call(thisArg, val, i, t)) {
                        res.push(val)
                    }
                }
            }
            return res
        }
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, thisArg) {
            var T, A, k;
            if (this == null) {
                throw new TypeError(" this is null or not defined")
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function")
            }
            if (arguments.length > 1) {
                T = thisArg
            }
            A = new Array(len);
            k = 0;
            while (k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[k];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue
                }
                k++
            }
            return A
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("apiVersionShortened", apiVersionShortened);

    function apiVersionShortened() {
        return function(input) {
            if (!input) return "-";
            return "DX" + input.substring(8)
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("avatarUrl", avatarUrl);
    avatarUrl.$inject = ["$filter"];

    function avatarUrl($filter) {
        return function(input) {
            if (!$filter("isNullOrEmpty")(input) && input.indexOf("fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb") == -1) {
                return input.replace(".jpg", "_medium.jpg")
            }
            return ""
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("formatRankingScore", formatRankingScore);
    formatRankingScore.$inject = ["$filter"];

    function formatRankingScore($filter) {
        return function(ladder) {
            if (ladder.ladderType && ladder.ladderType.toLowerCase().indexOf("fastest") > -1) return $filter("formatTimer")(ladder.rankingScore);
            else return $filter("number")(ladder.rankingScore, 0)
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("formatTimer", formatTimer);
    formatTimer.$inject = ["$filter"];

    function formatTimer($filter) {
        return function(input) {
            if (typeof input === "undefined") return "00:00:00";

            function z(n) {
                return (n < 10 ? "0" : "") + n
            }
            var seconds = input % 60;
            var minutes = Math.floor(input % 3600 / 60);
            var hours = Math.floor(input / 3600);
            var allTogether = hours > 0 ? hours + ":" : "";
            allTogether += (allTogether ? z(minutes) : minutes) + ":";
            allTogether += z(seconds);
            return allTogether
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("gpuShortened", gpuShortened);

    function gpuShortened() {
        return function(input) {
            if (!input) return "-";
            return input.replace("NVIDIA GeForce ", "").replace("AMD Radeon (TM) ", "").replace("AMD Radeon ", "")
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("inArray", inArray);

    function inArray() {
        return function(array, value) {
            return array.indexOf(value) !== -1
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("isNullOrEmpty", isNullOrEmpty);

    function isNullOrEmpty() {
        return function(input) {
            if (input == null) {
                return true
            } else if (typeof input === "object") {
                for (var key in input) {
                    if (input.hasOwnProperty(key)) {
                        return false
                    }
                }
                return true
            } else if (typeof input.length === "number") {
                return input.length === 0
            } else {
                return true
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("lookupGameResult", lookupGameResult);

    function lookupGameResult() {
        return function(match) {
            if (match.persona.dataInteger.result == 0) {
                return ""
            }
            if (match.dataString && match.dataString.gametype === "benchmark") {
                return "-"
            } else if (match.matchStateId == 3) {
                return "paused"
            } else if (match.persona.dataInteger.result == 1) {
                return "win"
            } else if (match.persona.dataInteger.result == -1) {
                return "loss"
            } else if (match.persona.dataInteger.result == null) {
                return ""
            } else {
                return "tie"
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("ordinalIndicator", ordinalIndicator);

    function ordinalIndicator() {
        return function(input) {
            var j = input % 10;
            var k = input % 100;
            if (j == 1 && k != 11) {
                return "st"
            }
            if (j == 2 && k != 12) {
                return "nd"
            }
            if (j == 3 && k != 13) {
                return "rd"
            }
            return "th"
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("resourceReverse", resourceReverse);
    resourceReverse.$inject = ["$filter", "configService"];

    function resourceReverse($filter, configService) {
        return function(resourceValue, resourceType, locale) {
            if (!locale) locale = configService.getLocale();
            if ($filter("isNullOrEmpty")(resourceValue) || $filter("isNullOrEmpty")(resourceType)) return "";
            if (window.Resources[resourceType] && window.Resources[resourceType][locale]) {
                var resources = window.Resources[resourceType][locale];
                for (var key in resources) {
                    if (resources[key.toLowerCase()] === resourceValue.toLowerCase()) {
                        return key
                    }
                }
            }
            return resourceValue
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("resource", resource);
    resource.$inject = ["$filter", "configService"];

    function resource($filter, configService) {
        return function(resourceKey, resourceType, defaultValue, locale) {
            if (!locale) locale = configService.getLocale();
            if ($filter("isNullOrEmpty")(resourceKey) || $filter("isNullOrEmpty")(resourceType)) return defaultValue ? defaultValue : "";
            if (window.Resources[resourceType] && window.Resources[resourceType][locale] && window.Resources[resourceType][locale][resourceKey.toLowerCase()]) return window.Resources[resourceType][locale][resourceKey.toLowerCase()];
            else return resourceKey
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").filter("versionShortened", versionShortened);

    function versionShortened() {
        return function(input) {
            if (!input) return "-";
            return input.substring(0, input.lastIndexOf("."))
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").factory("tachyonService", tachyonService);
    tachyonService.$inject = ["$q", "$http", "$filter", "configService"];

    function tachyonService($q, $http, $filter, configService) {
        var _service = {
            getDefaultLeague: getDefaultLeague,
            listLeagues: listLeagues,
            getActiveSeasonByGameType: getActiveSeasonByGameType,
            getSeason: getSeason,
            listSeasons: listSeasons,
            listActiveSeasons: listActiveSeasons,
            listSeasonsByGameType: listSeasonsByGameType,
            getLadderBySeasonByLadderType: getLadderBySeasonByLadderType,
            listActiveSeasonLaddersByGameType: listActiveSeasonLaddersByGameType,
            listActiveSeasonLaddersByGameTypeByCategory: listActiveSeasonLaddersByGameTypeByCategory,
            listLaddersBySeason: listLaddersBySeason,
            listLaddersBySeasonByGameTypeByCategory: listLaddersBySeasonByGameTypeByCategory,
            listLeaderboard: listLeaderboard,
            listLeaderboardByPersona: listLeaderboardByPersona,
            listLeaderboardsForPersona: listLeaderboardsForPersona,
            listPossibleBenchmarkFilters: listPossibleBenchmarkFilters,
            getMatch: getMatch,
            listMatches: listMatches,
            getPersona: getPersona,
            listPersonas: listPersonas,
            listAI: listAI,
            listFriends: listFriends,
            listAggregateStatsByPersona: listAggregateStatsByPersona,
            listAggregateStatsByPersonaLadder: listAggregateStatsByPersonaLadder,
            findStorage: findStorage,
            getStorage: getStorage,
            listStorage: listStorage,
            listReplays: listReplays,
            getGameVersion: getGameVersion
        };
        return _service;

        function getDefaultLeague() {
            return $http.get(configService.getProductUrl() + "/leagues/primary", {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listLeagues() {
            return $http.get(configService.getProductUrl(), {
                cache: true
            }).then(function(response) {
                return response.data.leagues
            }).catch(logError)
        }

        function listSeasons(leagueId) {
            var getLeagueIdPromise = $q.defer();
            if (leagueId) getLeagueIdPromise.resolve(leagueId);
            else getDefaultLeague().then(function(result) {
                getLeagueIdPromise.resolve(result.leagueId)
            });
            return getLeagueIdPromise.promise.then(function(leagueId) {
                return $http.get(configService.getProductUrl() + "/leagues/" + leagueId, {
                    cache: true
                }).then(function(response) {
                    return response.data.seasons
                }).catch(logError)
            })
        }

        function listSeasonsByGameType(gameType, leagueId) {
            return listSeasons(leagueId).then(function(result) {
                return $filter("orderBy")($filter("filter")(result, {
                    gameType: gameType
                }), "endDate", true)
            })
        }

        function listActiveSeasons(leagueId) {
            return listSeasons(leagueId).then(function(result) {
                return $filter("filter")(result, {
                    isActive: true
                })
            })
        }

        function getActiveSeasonByGameType(gameType, leagueId) {
            return listSeasons(leagueId).then(function(result) {
                return $filter("filter")(result, {
                    isActive: true,
                    gameType: gameType
                })[0]
            })
        }

        function getSeason(seasonId) {
            return $http.get(configService.getProductUrl() + "/seasons/" + seasonId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listLaddersBySeason(seasonId) {
            if (!seasonId) return $q.reject("No seasonId specified.");
            return $http.get(configService.getProductUrl() + "/seasons/" + seasonId, {
                cache: true
            }).then(function(response) {
                return response.data.ladders
            }).catch(logError)
        }

        function getLadderBySeasonByLadderType(seasonId, ladderType) {
            return listLaddersBySeason(seasonId).then(function(result) {
                return $filter("filter")(result, {
                    ladderType: ladderType
                })[0]
            })
        }

        function listActiveSeasonLaddersByGameType(gameType, leagueId) {
            return getActiveSeasonByGameType(gameType, leagueId).then(function(result) {
                return listLaddersBySeason(result.seasonId)
            })
        }

        function listActiveSeasonLaddersByGameTypeByCategory(gameType, category, leagueId) {
            return listActiveSeasonLaddersByGameType(gameType, leagueId).then(function(result) {
                return filterLaddersByGameTypeAndCategory(result, gameType, category)
            }).catch(logError)
        }

        function listLaddersBySeasonByGameTypeByCategory(seasonId, gameType, category) {
            return listLaddersBySeason(seasonId).then(function(result) {
                return filterLaddersByGameTypeAndCategory(result, gameType, category)
            }).catch(logError)
        }

        function listLeaderboard(ladderId, offset, count, centerOnPersonaId, friendsOf, includeMatchData, filters) {
            if (!ladderId) return $q.reject("No ladderId specified.");
            if (!count) return $q.reject("No personaId count.");
            if (typeof includeMatchData === "undefined") includeMatchData = false;
            var url = configService.getProductUrl() + "/leaderboards/ladder/" + ladderId;
            if (filters && !angular.equals({}, filters)) url += "/benchmarkfilter";
            url += "?offset=" + offset + "&count=" + count;
            if (centerOnPersonaId) url += "&teamId=" + centerOnPersonaId;
            if (includeMatchData) url += "&includeMatchData=" + includeMatchData;
            if (filters && !angular.equals({}, filters)) url += "&" + toQueryString(filters);
            if (friendsOf) url += "&friendsof=" + friendsOf;
            return $http.get(url, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listLeaderboardByPersona(ladderId, personaId, offset, count) {
            if (!ladderId) return $q.reject("No ladderId specified.");
            if (!personaId) return $q.reject("No personaId specified.");
            if (!offset) return $q.reject("No offset specified.");
            if (!count) return $q.reject("No personaId count.");
            return $http.get(configService.getProductUrl() + "/ladders/" + ladderId + "/persona/" + personaId + "?offset=" + offset + "&count=" + count, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listLeaderboardsForPersona(personaId) {
            if (!personaId) return $q.reject("No personaId specified.");
            return $http.get(configService.getProductUrl() + "/leaderboards/persona/" + personaId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listPossibleBenchmarkFilters(ladderId, filters) {
            if (!ladderId) return $q.reject("No ladderId specified.");
            var url = configService.getProductUrl() + "/leaderboards/ladder/" + ladderId + "/benchmarkfilter/options";
            if (filters && !angular.equals({}, filters)) url += "?" + toQueryString(filters);
            return $http.get(url, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listMatches(personaId, offset) {
            if (!personaId) return $q.reject("No personaId specified.");
            if (typeof offset == "undefined") return listAllMatches(personaId).then(function(matches) {
                return {
                    data: matches,
                    count: matches.length
                }
            });
            return $http.get(configService.getProductUrl() + "/matches?personaid=" + personaId + "&offset=" + offset + "&count=100", {
                cache: true
            }).then(returnDataList).catch(logError)
        }

        function listAllMatches(personaId) {
            var matches = [];
            var deferred = $q.defer();
            listMatches(personaId, 0).then(function(result) {
                matches = matches.concat(result.data);
                if (matches.length >= result.count) deferred.resolve(matches);
                else {
                    var additionalResultSets = [];
                    for (var i = 100; i < result.count; i += 100) {
                        additionalResultSets.push(listMatches(personaId, i).then(function(result) {
                            matches = matches.concat(result.data)
                        }))
                    }
                    $q.all(additionalResultSets).then(function() {
                        deferred.resolve(matches)
                    })
                }
            });
            return deferred.promise
        }

        function getMatch(matchId) {
            return $http.get(configService.getProductUrl() + "/matches/" + matchId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function getPersona(personaId) {
            if (!personaId) return $q.reject("No personaId specified.");
            return $http.get(configService.getApiUrl() + "/personas/" + personaId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listPersonas(name) {
            if (!name) return $q.reject("No name specified.");
            return $http.get(configService.getApiUrl() + "/personas?name=" + name.replace("?", ""), {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listAI() {
            return $q(function(resolve, reject) {
                resolve([{
                    personaId: "8D639DFC-6460-4D54-BE32-402DDC0BFB1C",
                    faction: "PHC"
                }, {
                    personaId: "0A3A2DB1-01A4-4561-8214-0553F65F8153",
                    faction: "PHC"
                }, {
                    personaId: "8C167514-CF67-47C7-BC1B-5CB2C31EB8D4",
                    faction: "PHC"
                }, {
                    personaId: "5D2E5A29-D05C-4A99-A955-15B10BCFB9A5",
                    faction: "Substrate"
                }, {
                    personaId: "4508AB51-FD4B-4EEF-868D-0BB46BE8C382",
                    faction: "Substrate"
                }, {
                    personaId: "CD38ADE5-4C4B-45DC-9351-9129206F414D",
                    faction: "Substrate"
                }, {
                    personaId: "8E1ADC3B-0104-4BDA-B42D-DD525AB41203",
                    faction: "Substrate"
                }, {
                    personaId: "58220B65-3E7F-45BE-A014-1E7D605A3E3D",
                    faction: "PHC"
                }, {
                    personaId: "14CCF4A4-2E96-4C15-BDEF-34AD31644756",
                    faction: "PHC"
                }, {
                    personaId: "828B4EA1-1628-4971-ADD9-69CA5A07B0D3",
                    faction: "PHC"
                }, {
                    personaId: "B6A23B18-EA9B-4850-9F8D-6385993C6B51",
                    faction: "PHC"
                }, {
                    personaId: "397A7E82-B7C0-4DA1-9676-048830760AAA",
                    faction: "PHC"
                }, {
                    personaId: "3D57B2C3-F231-4E3B-9045-0F3772AE21A4",
                    faction: "Substrate"
                }, {
                    personaId: "1A4EA62D-7D98-4BB2-BF61-1A7F6FBB1BD4",
                    faction: "Substrate"
                }, {
                    personaId: "500A14F5-E0B8-4E87-ABC0-33CAA3373D74",
                    faction: "Substrate"
                }, {
                    personaId: "F8F95354-4210-4D8E-9E9A-693C5B5322EE",
                    faction: "Substrate"
                }, {
                    personaId: "E27C2212-E09D-49D5-80E4-9507B6D6EAF0",
                    faction: "PHC"
                }, {
                    personaId: "3E3C0AFC-AF1C-408D-AA5C-8A54AC52AD6D",
                    faction: "Substrate"
                }, {
                    personaId: "2339C44E-E288-4A11-9A76-8ABCF4FA29F8",
                    faction: "Substrate"
                }, {
                    personaId: "6BE120A1-B609-412E-A023-C0539C31FC7B",
                    faction: "PHC"
                }, {
                    personaId: "0972B289-5272-4719-AA69-AC40E7B50249",
                    faction: "PHC"
                }, {
                    personaId: "A7A55C05-2BEE-417B-9783-03B362B6552D",
                    faction: "PHC"
                }, {
                    personaId: "AB8CC4E9-0666-4900-9C88-8887DDCD52BB",
                    faction: "PHC"
                }, {
                    personaId: "337DC03C-56C2-4251-8EC4-31161D7CC3DF",
                    faction: "PHC"
                }, {
                    personaId: "84D6CA4A-CFBC-45D8-AB87-1EB8F5BAA645",
                    faction: "PHC"
                }, {
                    personaId: "40345ADC-2A7A-4F52-A89C-6A40458B2379",
                    faction: "Substrate"
                }, {
                    personaId: "C9DBCF71-EB52-4EF3-B524-8D67E93978A8",
                    faction: "Substrate"
                }, {
                    personaId: "EFCCAE10-CBC9-4444-B93C-B55FC71BB437",
                    faction: "Substrate"
                }, {
                    personaId: "C640F9A1-4603-4468-8511-EC1EF7B04AAC",
                    faction: "Substrate"
                }, {
                    personaId: "0474F493-4D69-43EB-9939-3E473B11FFD1",
                    faction: "Substrate"
                }, {
                    personaId: "77362968-C1E4-4D5B-A939-000AECB95947",
                    faction: "PHC"
                }, {
                    personaId: "E17FFCEC-D05A-4B27-8FAA-AE4022DC8B79",
                    faction: "Substrate"
                }, {
                    personaId: "280C70B7-A848-4544-8EFF-2CD508420FA6",
                    faction: "Substrate"
                }, {
                    personaId: "D1E3AE6A-EE2F-4883-A639-2AAB66C6E562",
                    faction: "Substrate"
                }, {
                    personaId: "761FFCA8-DFF1-4F92-921F-ADF8DDCB7EBD",
                    faction: "PHC"
                }, {
                    personaId: "1177F1F5-BDC6-4993-8145-2744F4AE2BF9",
                    faction: "Substrate"
                }, {
                    personaId: "6FC7B2B4-620D-4FB1-A241-89BA7B8A51AF",
                    faction: "PHC"
                }, {
                    personaId: "D9381074-8286-4E7F-9166-DAAC326305C3",
                    faction: "PHC"
                }, {
                    personaId: "A6FA9993-3EC7-4C95-9645-932CC3DAEABE",
                    faction: "PHC"
                }, {
                    personaId: "D68B4052-8DC7-4E1F-AE72-03CE3EF6F04D",
                    faction: "PHC"
                }, {
                    personaId: "BF43127F-E7DC-40AD-B997-08A6033CDB6E",
                    faction: "PHC"
                }, {
                    personaId: "8E286A3A-D459-4850-8D86-7A9483DF2933",
                    faction: "PHC"
                }, {
                    personaId: "B7F5A4C7-6E24-4E52-91BE-5D5BF79F2C9D",
                    faction: "Substrate"
                }, {
                    personaId: "B77FA05C-B07C-4F7C-AAAE-6D1BDD623F68",
                    faction: "Substrate"
                }, {
                    personaId: "29A14FE1-32C9-4C88-BBFB-32A731FBFABF",
                    faction: "Substrate"
                }, {
                    personaId: "B42C5A8D-D140-421C-8D7E-4B22E1E1019F",
                    faction: "Substrate"
                }, {
                    personaId: "CE30F6A0-F558-461D-A144-71175EE0AE59",
                    faction: "Substrate"
                }, {
                    personaId: "01263664-0B45-437A-A687-CF3A1C5D7972",
                    faction: "PHC"
                }, {
                    personaId: "D743F7D4-C02E-4A43-B375-6DCCE953BF05",
                    faction: "PHC"
                }, {
                    personaId: "9913D216-CF48-4D01-A14A-9872758F8CC5",
                    faction: "PHC"
                }, {
                    personaId: "68F7E2BF-6AEE-4FFC-8AA6-A30C5017568E",
                    faction: "Substrate"
                }, {
                    personaId: "EFCFCA29-A197-472D-887B-3BA0F424D0C0",
                    faction: "PHC"
                }, {
                    personaId: "7974EAF8-39F5-4B7B-A7AE-AF9FA97EB883",
                    faction: "PHC"
                }, {
                    personaId: "6DCE0B2C-82AB-43F5-8E75-7B8326B4901B",
                    faction: "PHC"
                }, {
                    personaId: "9C5D4B9A-BD17-43B1-A813-8240F51905F8",
                    faction: "PHC"
                }, {
                    personaId: "D38D7187-1798-4F4B-A27A-114FCFE52545",
                    faction: "PHC"
                }, {
                    personaId: "18164FA3-007F-44B6-BA0B-D9BC101F6B79",
                    faction: "Substrate"
                }, {
                    personaId: "E6F58727-1885-418C-81A4-18DAD2ED7D1F",
                    faction: "Substrate"
                }, {
                    personaId: "07ED76C9-9899-458A-A36E-CAA9278EAEE6",
                    faction: "Substrate"
                }, {
                    personaId: "C1F38A21-0851-4E1D-BC3C-A5E4CD2CE4CE",
                    faction: "Substrate"
                }, {
                    personaId: "19B9A617-89AE-43CA-80A2-9D91D270747E",
                    faction: "Substrate"
                }, {
                    personaId: "AEA7892E-8371-4109-A77D-6A63629F0A28",
                    faction: "PHC"
                }, {
                    personaId: "421BFD5A-537B-4E1D-B34F-56835D8B5686",
                    faction: "PHC"
                }, {
                    personaId: "C6C86D35-13BA-4536-BAF3-CEEF675AB9E3",
                    faction: "Substrate"
                }, {
                    personaId: "C10E35CD-7EFD-4B30-BCF9-EED7D79F5E13",
                    faction: "PHC"
                }, {
                    personaId: "AC4D7A14-2300-44A3-B6DC-1430A7C27D4B",
                    faction: "Substrate"
                }, {
                    personaId: "C4115FB2-5878-4D63-B862-C178AE376D3F",
                    faction: "Substrate"
                }, {
                    personaId: "589C1E52-C161-47CE-A9C9-72C0691E33E5",
                    faction: "PHC"
                }, {
                    personaId: "1A7A2E24-9BEC-438A-8E22-34B6811A916A",
                    faction: "PHC"
                }])
            })
        }

        function listFriends(profileId) {
            var deferred = $q.defer();
            $http.get(configService.getApiUrl() + "/profiles/" + profileId + "/friends?ProductId=" + configService.getProductId(), {
                cache: true
            }).success(function(result) {
                deferred.resolve(result)
            }).error(function() {
                deferred.reject("Failed to load friends for profile " + profileId + ".")
            });
            return deferred.promise
        }

        function listAggregateStatsByPersona(personaId) {
            if (!personaId) return $q.reject("No personaId specified.");
            return $http.get(configService.getProductUrl() + "/stats/aggregate?statType=64&personaId=" + personaId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listAggregateStatsByPersonaLadder(personaLadderId) {
            if (!personaLadderId) return $q.reject("No personaLadderId specified.");
            return $http.get(configService.getProductUrl() + "/stats/aggregate?statType=32&personaLadderId=" + personaLadderId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function findStorage(personaId, matchId, storageType) {
            if (!personaId) return $q.reject("No personaId specified.");
            else if (!matchId) return $q.reject("No matchId specified.");
            else if (!storageType) return $q.reject("No storageType specified.");
            return $http.get(configService.getProductUrl() + "/storage/find?personaId=" + personaId + "&matchId=" + matchId + "&storageType=" + storageType, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function getStorage(storageId) {
            if (!storageId) return $q.reject("No storageId specified.");
            return $http.get(configService.getProductUrl() + "/storage/" + storageId, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listStorage(personaId, matchId, storageType) {
            if (!personaId && !matchId) return $q.reject("No ids specified.");
            var url = configService.getProductUrl() + "/storage/?";
            if (personaId) url += "&personaId=" + personaId;
            if (matchId) url += "&matchId=" + matchId;
            if (storageType) url += "&storageType=" + storageType;
            return $http.get(url, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function listReplays(ladderType, version) {
            if (!ladderType && !version) return $q.reject("Not enough input data specified.");
            var url = configService.getProductUrl() + "/storage/matchpersonareplays/?ladderType=" + ladderType + "&version=" + version;
            return $http.get(url, {
                cache: true
            }).then(returnData).catch(logError)
        }

        function getGameVersion() {
            return $http.get("tachyon://tachyon/version").then(returnData).catch(function() {
                return {
                    version: "2.20.25957.0"
                }
            })
        }

        function returnData(response) {
            return response.data
        }

        function returnDataList(response) {
            return {
                count: response.headers()["x-total"],
                data: response.data
            }
        }

        function logError(e) {
            console.log(e);
            return $q.reject(e)
        }

        function filterLaddersByGameTypeAndCategory(ladders, gameType, category) {
            var configuredLadderTypeNames = configService.listLadderTypeNames(gameType, category);
            var filteredLadders = [];
            ladders.sort(function(a, b) {
                var aIndex = configuredLadderTypeNames.indexOf(a.ladderType);
                var bIndex = configuredLadderTypeNames.indexOf(b.ladderType);
                if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
                else if (aIndex > -1) return 1;
                else return -1
            });
            for (var i = 0; i < ladders.length; i++)
                if (configuredLadderTypeNames.indexOf(ladders[i].ladderType) > -1) filteredLadders.push(ladders[i]);
            return filteredLadders
        }

        function toQueryString(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                }
            return str.join("&")
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").factory("configService", configService);
    configService.$inject = ["$location", "$filter", "$stateParams", "$cookies"];

    function configService($location, $filter, $stateParams, $cookies) {
        var _config = {
            baseApiUrl: "https://ashesescalation-api-tachyon.stardock.net",
            apiUrl: null,
            productUrl: null,
            productId: 2641,
            locale: "en-us",
            supportedLocales: ["en-us"],
            defaultGameType: "single",
            defaultCategory: "overall",
            ladders: {
                single: {
                    overall: ["SinglePlayerOverall", "SP_FastestWin", "UnitsKilled", "TitansKilled", "StructuresKilled"],
                    faction: ["PHC", "Substrate"],
                    maps: ["Acheron", "Bis", "Canopus", "Castor", "CloseQuarters", "Crawford", "Deneb", "Elysium", "Europa", "KnifeFight", "Nightshade", "OrionsSpur", "Pollux", "Pulaski", "Qoshyk", "Rosette", "Styx", "Tartarus"],
                    difficulty: ["Beginner", "Novice", "Easy", "Intermediate", "Normal", "Challenging", "Tough", "Painful", "Insane"],
                    campaign_1: ["C1.Mission1_Title", "C1.Mission1a_Title", "C1.Mission2_Title", "C1.Mission3_Title", "C1.Mission4_Title", "C1.Mission_Roceda", "C1.Mission5_Title", "C1.Mission6_Title", "C1.Mission_Falnass", "C1.Mission7_Title", "C1.Mission_Silgul_Title", "C1.Mission8_Title"],
                    "campaign_1.5": ["C1.5.Origins_Ceres_Title", "C1.5.Origins_Ganymede_Title", "C1.5.Origins_Europa_Title"],
                    campaign_2: ["C2.Escalation_Orionspur_Title", "C2.Escalation_Betelgeuse_Title", "C2.Escalation_Rosette_Title", "C2.Escalation_Leo_Title", "C2.Escalation_Lagoan_Title", "C2.Escalation_Polaris_Title", "C2.Escalation_Alnitak_Title", "C2.Escalation_Alnilam_Title", "C2.Escalation_Altaria_Title"],
                    campaign_3: ["C3.Genesis_Cass_Title", "C3.Genesis_Glarus_Title", "C3.Genesis_Atwater_Title", "C3.Genesis_Griffinclaw_Title", "C3.Genesis_Bauhaus_Title", "C3.Genesis_Auctor_Title"],
                    scenario: ["Scenario_AgainstAllOdds", "Scenario_Assault", "Scenario_Eruption", "Scenario_Gauntlet", "Scenario_Implosion", "Scenario_KingOfTheHill", "Scenario_Mountaintop", "Scenario_Overlord", "Scenario_Oblivion", "Scenario_TurtleWars"]
                },
                multi: {
                    overall: ["Ranked"]
                },
                benchmark: {
                    overall: ["Crazy_5K", "Crazy_4k", "Crazy_1440p", "Crazy_1080p", "High_5K", "High_4k", "High_1440p", "High_1080p", "Medium_5K", "Medium_4k", "Medium_1440p", "Medium_1080p", "Low_1080p", "Low_900p", "Min_1080p", "Min_900p"]
                }
            },
            laddersFlattened: [],
            leaderboardColumnSets: {
                default: {
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "score",
                        property: "rankingScore",
                        filter: "number:0"
                    }, {
                        name: "matches",
                        property: "totalMatchesPlayed",
                        filter: "number:0"
                    }]
                },
                multi: {
                    targetType: "gameType",
                    columns: [{
                        name: "rank",
                        directive: "rank-column"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "preferred_faction",
                        property: "preferredFaction"
                    }, {
                        name: "rating",
                        expression: '<rating-column record="$ctrl.record"></rating-column>'
                    }]
                },
                benchmark: {
                    targetType: "gameType",
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "api",
                        property: 'matches[0].participants[0].dataString["x-API"]',
                        filter: "apiVersionShortened"
                    }, {
                        name: "avg_fps",
                        property: 'matches[0].participants[0].dataFloat["x-AvgFrameRate_All"]',
                        filter: "number:0"
                    }, {
                        name: "gpu",
                        expression: '{{$ctrl.record.matches[0].participants[0].dataString["x-GPU"] | gpuShortened}}<span ng-show="$ctrl.record.matches[0].participants[0].dataString[\'x-GPU-2\']">(mGPU)</span>'
                    }, {
                        name: "score",
                        property: "rankingScore",
                        filter: "number:0"
                    }]
                },
                SP_FastestWin: {
                    targetType: "ladderType",
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "time",
                        property: "rankingScore",
                        filter: "formatTimer"
                    }, {
                        name: "matches",
                        property: "totalMatchesPlayed",
                        filter: "number:0"
                    }]
                },
                UnitsKilled: {
                    targetType: "ladderType",
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "units",
                        property: "rankingScore",
                        filter: "number:0"
                    }, {
                        name: "matches",
                        property: "totalMatchesPlayed",
                        filter: "number:0"
                    }]
                },
                TitansKilled: {
                    targetType: "ladderType",
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "titans",
                        property: "rankingScore",
                        filter: "number:0"
                    }, {
                        name: "matches",
                        property: "totalMatchesPlayed",
                        filter: "number:0"
                    }]
                },
                StructuresKilled: {
                    targetType: "ladderType",
                    columns: [{
                        name: "rank",
                        property: "rank",
                        filter: "number:0"
                    }, {
                        name: "persona",
                        directive: "persona-column"
                    }, {
                        name: "structures",
                        property: "rankingScore",
                        filter: "number:0"
                    }, {
                        name: "matches",
                        property: "totalMatchesPlayed",
                        filter: "number:0"
                    }]
                }
            },
            matchHistoryColumnSets: {
                default: {
                    primaryColumns: [{
                        name: "score",
                        expression: '{{($ctrl.record.persona.dataInteger["x-BenchmarkScore"] || $ctrl.record.persona.dataInteger["score"] || 0) | number:0}}'
                    }, {
                        name: "result",
                        expression: '{{$ctrl.record | lookupGameResult | resource:"game_results"}}'
                    }, {
                        name: "faction",
                        property: 'persona.dataString["faction"]'
                    }, {
                        name: "opponent",
                        directive: "opponent-column"
                    }, {
                        name: "map",
                        property: 'dataString["map-name"]',
                        filter: 'resource:"map_names"'
                    }, {
                        name: "date",
                        property: "createDate",
                        filter: 'amDateFormat:"MM/DD/YY"'
                    }, {
                        name: "replay",
                        expression: '<replay-column storage-id="$ctrl.record.replayStorageInfo.storageId" map="$ctrl.record.dataString[\'map-name\']" duration="$ctrl.record.dataInteger[\'duration\'] | formatTimer"></replay-column>'
                    }],
                    detailColumns: [{
                        name: "length",
                        property: 'persona.dataInteger["duration"]',
                        filter: "formatTimer"
                    }, {
                        name: "type",
                        property: 'dataString["type"]',
                        filter: 'resource:"ladders_names_short"'
                    }, {
                        name: "units_built",
                        property: 'persona.dataInteger["x-UnitsBuilt"]',
                        filter: "number:0"
                    }, {
                        name: "units_lost",
                        property: 'persona.dataInteger["x-UnitsLost"]',
                        filter: "number:0"
                    }, {
                        name: "units_killed",
                        property: 'persona.dataInteger["x-UnitsKilled"]',
                        filter: "number:0"
                    }, {
                        name: "structures_built",
                        property: 'persona.dataInteger["x-StructuresBuilt"]',
                        filter: "number:0"
                    }, {
                        name: "structures_lost",
                        property: 'persona.dataInteger["x-StructuresLost"]',
                        filter: "number:0"
                    }, {
                        name: "structures_destroyed",
                        property: 'persona.dataInteger["x-StructuresKilled"]',
                        filter: "number:0"
                    }, {
                        name: "titans_built",
                        property: 'persona.dataInteger["x-TitansBuilt"]',
                        filter: "number:0"
                    }, {
                        name: "titans_lost",
                        property: 'persona.dataInteger["x-TitansLost"]',
                        filter: "number:0"
                    }, {
                        name: "titans_killed",
                        property: 'persona.dataInteger["x-TitansKilled"]',
                        filter: "number:0"
                    }]
                },
                benchmark: {
                    targetType: "gameType",
                    primaryColumns: [{
                        name: "score",
                        property: 'persona.dataInteger["x-BenchmarkScore"]',
                        filter: "number:0"
                    }, {
                        name: "category",
                        property: 'dataString["x-Preset"]',
                        filter: 'resource:"ladders_names":"Other"'
                    }, {
                        name: "version",
                        property: "version"
                    }, {
                        name: "api",
                        property: 'participants[0].dataString["x-API"]',
                        filter: "apiVersionShortened"
                    }, {
                        name: "avg_fps",
                        property: 'participants[0].dataFloat["x-AvgFrameRate_All"]',
                        filter: "number:0"
                    }, {
                        name: "gpu",
                        expression: '{{$ctrl.record.participants[0].dataString["x-GPU"] | gpuShortened}}{{$ctrl.record.participants[0].dataString["x-GPU-2"] ? "*" : ""}}'
                    }, {
                        name: "date",
                        property: "createDate",
                        filter: 'amDateFormat:"MM/DD/YY"'
                    }]
                },
                hof: {
                    targetType: "gameType",
                    primaryColumns: [{
                        name: "score",
                        expression: '{{($ctrl.record.persona.dataInteger["x-BenchmarkScore"] || $ctrl.record.persona.dataInteger["score"] || 0) | number:0}}'
                    }, {
                        name: "result",
                        expression: '{{$ctrl.record | lookupGameResult | resource:"game_results"}}'
                    }, {
                        name: "units_blk",
                        expression: '{{$ctrl.record.persona.dataInteger["x-UnitsBuilt"] | number:0}} - {{$ctrl.record.persona.dataInteger["x-UnitsLost"] | number:0}} - {{$ctrl.record.persona.dataInteger["x-UnitsKilled"] | number:0}}'
                    }, {
                        name: "structures_blk",
                        expression: '{{$ctrl.record.persona.dataInteger["x-StructuresBuilt"] | number:0}} - {{$ctrl.record.persona.dataInteger["x-StructuresLost"] | number:0}} - {{$ctrl.record.persona.dataInteger["x-StructuresKilled"] | number:0}}'
                    }, {
                        name: "length",
                        property: 'persona.dataInteger["duration"]',
                        filter: "formatTimer"
                    }, {
                        name: "date",
                        property: "createDate",
                        filter: 'amDateFormat:"MM/DD/YY"'
                    }],
                    detailColumns: [{
                        name: "faction",
                        property: 'persona.dataString["faction"]'
                    }, {
                        name: "titans_built",
                        property: 'persona.dataInteger["x-TitansBuilt"]',
                        filter: "number:0"
                    }, {
                        name: "titans_lost",
                        property: 'persona.dataInteger["x-TitansLost"]',
                        filter: "number:0"
                    }, {
                        name: "titans_killed",
                        property: 'persona.dataInteger["x-TitansKilled"]',
                        filter: "number:0"
                    }]
                }
            },
            replayColumnSets: {
                default: {
                    primaryColumns: [{
                        name: "rank",
                        expression: '<replay-rank-column bracket-id="$ctrl.record.personaRanks[0].bracketId" rank="$ctrl.record.personaRanks[0].rankId"></replay-rank-column>'
                    }, {
                        name: "persona",
                        expression: '<replay-persona-column persona-name="$ctrl.record.personaRanks[0].name" avatar-url="$ctrl.record.personaRanks[0].avatarUrl"></replay-persona-column>'
                    }, {
                        name: "faction",
                        property: 'match.participants[0].dataString["faction"]'
                    }, {
                        name: "vs",
                        expression: "vs"
                    }, {
                        name: "faction",
                        property: 'match.participants[1].dataString["faction"]'
                    }, {
                        name: "persona",
                        expression: '<replay-persona-column persona-name="$ctrl.record.personaRanks[1].name" avatar-url="$ctrl.record.personaRanks[1].avatarUrl"></replay-persona-column>'
                    }, {
                        name: "rank",
                        expression: '<replay-rank-column bracket-id="$ctrl.record.personaRanks[1].bracketId" rank="$ctrl.record.personaRanks[1].rankId"></replay-rank-column>'
                    }, {
                        name: "replay",
                        expression: '<replay-column storage-id="$ctrl.record.storageId" map="$ctrl.record.match.dataString[\'map-name\']" duration="$ctrl.record.match.dataInteger[\'duration\'] | formatTimer"></replay-column>'
                    }]
                }
            }
        };
        (function init() {
            setApiUrl();
            setLocale();
            populateLadderDetails()
        })();

        function setApiUrl() {
            if ($stateParams["api"] != null) {
                var api = $stateParams["api"];
                if (api.indexOf("http") != 0) api = "https://" + api;
                var re = new RegExp("https?://[a-z0-9-]+.stardock.net");
                if (re.test(api)) _config.baseApiUrl = api
            }
        }

        function setLocale() {
            var selectedLocale;
            if ($stateParams["locale"] != null) selectedLocale = $stateParams["locale"];
            else selectedLocale = (navigator.language || navigator.userLanguage).toLowerCase();
            if (!$filter("isNullOrEmpty")(selectedLocale) && isLocaleSupported(selectedLocale)) {
                _config.locale = selectedLocale
            }
        }

        function populateLadderDetails() {
            _config.laddersFlattened = [];
            var ladders = _listConfiguredLadders();
            for (var gameType in ladders) {
                for (var category in ladders[gameType]) {
                    for (var i = 0; i < ladders[gameType][category].length; i++) {
                        var ladderType = ladders[gameType][category][i];
                        if (!_config.laddersFlattened[ladderType]) {
                            _config.laddersFlattened[ladderType] = {
                                gameType: gameType,
                                category: category,
                                ladderType: ladderType
                            }
                        } else {
                            console.warn("Multiple ladders are defined with a ladderType of " + ladderType)
                        }
                    }
                }
            }
        }
        var _service = {
            getLocale: getLocale,
            getSupportedLocales: getSupportedLocales,
            isLocaleSupported: isLocaleSupported,
            getApiUrl: getApiUrl,
            getProductUrl: getProductUrl,
            getProductId: getProductId,
            getDefaultGameType: getDefaultGameType,
            getDefaultCategory: getDefaultCategory,
            getDefaultLadderType: getDefaultLadderType,
            getGameTypeName: getGameTypeName,
            getCategoryName: getCategoryName,
            getLadderType: getLadderType,
            listGameTypes: listGameTypes,
            listGameTypeNames: listGameTypeNames,
            listCategories: listCategories,
            listCategoryNames: listCategoryNames,
            listLadderTypes: listLadderTypes,
            listLadderTypeNames: listLadderTypeNames,
            getMatchHistoryColumnSet: getMatchHistoryColumnSet,
            getConfiguredLeaderboardColumnSet: getConfiguredLeaderboardColumnSet,
            getCurrentUser: getCurrentUser,
            getReplaysColumnSet: getReplaysColumnSet
        };
        return _service;

        function getApiUrl() {
            setApiUrl();
            if (_config.apiUrl == null) {
                _config.apiUrl = _config.baseApiUrl;
                if (_config.apiUrl.charAt(_config.apiUrl.length - 1) !== "/") {
                    _config.apiUrl += "/"
                }
                _config.apiUrl += "v1"
            }
            return _config.apiUrl
        }

        function getProductUrl() {
            if (_config.productUrl == null) {
                _config.productUrl = this.getApiUrl() + "/products/" + this.getProductId()
            }
            return _config.productUrl
        }

        function getProductId() {
            return _config.productId
        }

        function getLocale() {
            setLocale();
            return _config.locale
        }

        function getSupportedLocales() {
            return _config.supportedLocales
        }

        function isLocaleSupported(locale) {
            for (var index = 0; index < _config.supportedLocales.length; index++) {
                if (locale === _config.supportedLocales[index]) {
                    return true
                }
            }
            return false
        }

        function _listConfiguredLadders() {
            if (!_config.ladders) throw "Ladders were not set.";
            return _config.ladders
        }

        function getDefaultGameType() {
            return Object.keys(_listConfiguredLadders())[0]
        }

        function getDefaultCategory(gameType) {
            if (!gameType) throw "gameType was empty.";
            if (!_listConfiguredLadders()[gameType]) throw "gameType does not exist in ladder configuration.";
            if (_listConfiguredLadders()[gameType].length === 0) throw "Categories were not specified for the requested gameType.";
            return Object.keys(_listConfiguredLadders()[gameType])[0]
        }

        function getDefaultLadderType(gameType, category) {
            if (!gameType) throw "gameType was empty.";
            if (!category) throw "category was empty.";
            if (!_listConfiguredLadders()[gameType]) throw "Specified gameType does not exist.";
            if (!_listConfiguredLadders()[gameType][category]) throw "Specified category does not exist.";
            if (_listConfiguredLadders()[gameType][category].length === 0) throw "ladderTypes were not specified for the requested category.";
            if (gameType === "benchmark" && category === "overall") return "Medium_1080p";
            return _listConfiguredLadders()[gameType][category][0]
        }

        function getGameTypeName(ladderType) {
            return _config.laddersFlattened[ladderType] ? _config.laddersFlattened[ladderType].gameType : null
        }

        function getCategoryName(ladderType) {
            return _config.laddersFlattened[ladderType] ? _config.laddersFlattened[ladderType].category : null
        }

        function getLadderType(ladderType) {
            return _config.laddersFlattened[ladderType]
        }

        function listGameTypes() {
            var gameTypes = [];
            for (var gameType in _listConfiguredLadders()) gameTypes.push({
                gameType: gameType,
                defaultCategory: getDefaultCategory(gameType)
            });
            return gameTypes
        }

        function listGameTypeNames() {
            return listGameTypes().map(function(i) {
                return i.gameType
            })
        }

        function listCategories(gameType) {
            var categories = [];
            if (!gameType) throw "gameType was empty.";
            var ladders = _listConfiguredLadders();
            if (!ladders[gameType]) throw "Specified gameType does not exist.";
            for (var category in ladders[gameType]) categories.push({
                gameType: gameType,
                category: category,
                defaultLadderType: getDefaultLadderType(gameType, category)
            });
            return categories
        }

        function listCategoryNames(gameType) {
            return listCategories(gameType).map(function(i) {
                return i.category
            })
        }

        function listLadderTypes(gameType, category) {
            var ladders = [];
            if (!gameType) ladders = Object.keys(_config.laddersFlattened).map(function(key) {
                return _config.laddersFlattened[key]
            });
            else {
                for (var ladderType in _config.laddersFlattened) {
                    var ladder = _config.laddersFlattened[ladderType];
                    if (gameType === ladder.gameType)
                        if (!category || category === ladder.category) ladders.push(ladder)
                }
            }
            return ladders
        }

        function listLadderTypeNames(gameType, category) {
            return listLadderTypes(gameType, category).map(function(i) {
                return i.ladderType
            })
        }

        function getMatchHistoryColumnSet(gameType) {
            if (_config.leaderboardColumnSets) {
                if (gameType && _config.matchHistoryColumnSets[gameType.toLowerCase()] && _config.matchHistoryColumnSets[gameType.toLowerCase()].targetType === "gameType") {
                    return _config.matchHistoryColumnSets[gameType.toLowerCase()]
                } else if (_config.matchHistoryColumnSets["default"] != null) {
                    return _config.matchHistoryColumnSets["default"]
                }
            } else {
                return null
            }
        }

        function getConfiguredLeaderboardColumnSet(ladderType, category, gameType) {
            if (_config.leaderboardColumnSets) {
                if (ladderType != null && _config.leaderboardColumnSets[ladderType] && _config.leaderboardColumnSets[ladderType].targetType === "ladderType") {
                    return _config.leaderboardColumnSets[ladderType]
                } else if (category != null && _config.leaderboardColumnSets[category] && _config.leaderboardColumnSets[category].targetType === "category") {
                    return _config.leaderboardColumnSets[category]
                } else if (gameType != null && _config.leaderboardColumnSets[gameType] && _config.leaderboardColumnSets[gameType].targetType === "gameType") {
                    return _config.leaderboardColumnSets[gameType]
                } else if (_config.leaderboardColumnSets["default"] != null) {
                    return _config.leaderboardColumnSets["default"]
                }
            } else {
                return null
            }
        }

        function getCurrentUser() {
            if (sharedStorage) return sharedStorage.get("personaId").then(function(personaId) {
                return {
                    personaId: personaId
                }
            })
        }

        function getReplaysColumnSet() {
            return _config.replayColumnSets["default"]
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("cardDeck", {
        bindings: {
            ladders: "=",
            personaId: "="
        },
        controller: cardDeckCtrl,
        templateUrl: "./Client/templates/archives/directives/card-deck.html"
    });
    cardDeckCtrl.$inject = ["$scope", "$timeout", "configService"];

    function cardDeckCtrl($scope, $timeout, configService) {
        var vm = this;
        vm.disabledLeftScroll = true;
        vm.disabledRightScroll = false;
        vm.posX = 0;
        vm.nextCards = nextCards;
        vm.prevCards = prevCards;
        vm.$onInit = init;
        var cachedContainerWidth = 0;
        var cachedContentWidth = 0;

        function init() {
            $timeout(function() {
                $scope.$on("scrollable.dimensions", dimensionsDetected);
                $scope.$emit("content.changed");
                $scope.$watch("$ctrl.posX", scrollDetected)
            })
        }

        function nextCards() {
            vm.posX += 220
        }

        function prevCards() {
            vm.posX -= 220
        }

        function dimensionsDetected(e, containerWidth, containerHeight, contentWidth, contentHeight, id) {
            cachedContainerWidth = containerWidth;
            cachedContentWidth = contentWidth
        }

        function scrollDetected() {
            if (cachedContentWidth === 0) return;
            if (vm.posX >= cachedContentWidth - cachedContainerWidth) vm.disabledRightScroll = true;
            else if (vm.posX === 0) vm.disabledLeftScroll = true;
            else vm.disabledRightScroll = vm.disabledLeftScroll = false
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").directive("configurableTableColumn", configurableTableColumn);
    configurableTableColumn.$inject = ["$compile", "$templateCache"];

    function configurableTableColumn($compile, $templateCache) {
        var directive = {
            bindToController: {
                column: "=column",
                record: "=record"
            },
            compile: compile,
            controller: function() {},
            controllerAs: "$ctrl",
            restrict: "A",
            scope: {}
        };
        return directive;

        function compile(element, attrs) {
            return function(scope, element, attrs, controller) {
                var vm = controller;
                attrs.$addClass(vm.column.name);
                if (vm.column.directive) {
                    element.html($templateCache.get("./Client/templates/archives/directives/" + vm.column.directive + ".html"))
                } else if (vm.column.expression) {
                    element.html(vm.column.expression)
                } else {
                    var expression = "{{$ctrl.record." + vm.column.property;
                    if (vm.column.filter) expression += " | " + vm.column.filter;
                    expression += "}}";
                    element.html(expression)
                }
                return $compile(element.contents())(scope)
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("configurableTable", {
        bindings: {
            columnConfig: "=",
            emptyMessage: "=",
            loading: "=",
            onClick: "&",
            rows: "="
        },
        templateUrl: "./Client/templates/archives/directives/configurable-table.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").directive("infiniteScroll", infiniteScroll);

    function infiniteScroll() {
        var directive = {
            bindToController: {
                atStart: "&",
                atEnd: "&"
            },
            controller: function() {},
            controllerAs: "vm",
            link: link,
            restrict: "A",
            scope: {}
        };
        return directive;

        function link(scope, element, attrs, controller) {
            var vm = controller;
            element.scroll(function() {
                var visibleHeight = element.height();
                var threshold = visibleHeight;
                var scrollableHeight = element.prop("scrollHeight");
                var hiddenContentHeight = scrollableHeight - visibleHeight;
                if (hiddenContentHeight - element.scrollTop() <= threshold) {
                    vm.atEnd()()
                } else if (element.scrollTop() < threshold) {
                    vm.atStart()()
                }
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("leaderboardOneColumn", {
        bindings: {
            category: "=",
            filters: "=",
            gameType: "=",
            ladder: "=",
            pageSize: "=",
            personaId: "=",
            viewType: "="
        },
        controller: leaderboardOneColumnCtrl,
        require: {
            leaderboardCtrl: "^leaderboard"
        },
        templateUrl: "./Client/templates/archives/directives/leaderboard-one-column.html"
    });
    leaderboardOneColumnCtrl.$inject = ["$scope", "$q", "$state", "$timeout", "$filter", "configService", "tachyonService"];

    function leaderboardOneColumnCtrl($scope, $q, $state, $timeout, $filter, configService, tachyonService) {
        var vm = this;
        vm.comingSoon = false;
        vm.endReached = true;
        vm.loading = true;
        vm.offset = 0;
        vm.personaRank = -1;
        vm.personas = [];
        vm.startReached = true;
        vm.goToPlayer = goToPlayer;
        vm.loadLeaderboardPage = loadLeaderboardPage;
        vm.loadNextPage = loadNextPage;
        vm.loadPrevPage = loadPrevPage;
        vm.$onInit = init;

        function init() {
            vm.columnSet = configService.getConfiguredLeaderboardColumnSet(vm.ladder.ladderType, vm.category, vm.gameType);
            vm.loadLeaderboardPage(0)
        }

        function loadPrevPage() {
            if (vm.startReached) return;
            if (vm.viewType === "myself") vm.offset = vm.personas[0].rank - vm.personaRank - vm.pageSize;
            else vm.offset = vm.personas[0].rank - vm.pageSize;
            vm.startReached = true;
            vm.loadLeaderboardPage(-1)
        }

        function loadNextPage() {
            if (vm.endReached) return;
            if (vm.viewType === "myself") vm.offset = vm.personas[vm.personas.length - 1].rank - vm.personaRank + (vm.personaRank > 0 ? 1 : 0);
            else vm.offset = vm.personas[vm.personas.length - 1].rank;
            vm.endReached = true;
            vm.loadLeaderboardPage(1)
        }

        function goToPlayer(persona) {
            if (vm.gameType.toLowerCase() === "benchmark") $state.go("root.persona.matchDetails", {
                personaId: persona.personaId,
                matchId: persona.matchId
            });
            else $state.go("root.persona.summary", {
                ladderId: vm.ladder.ladderId,
                personaId: persona.personaId
            })
        }

        function loadLeaderboardPage(newOffset) {
            if (!vm.scrollDisabled) vm.loading = true;
            var clientVersion = "0";
            tachyonService.getGameVersion().then(function(ver) {
                clientVersion = ver.version.replace(/\./g, "");
                getPersonaRankAsync().then(function() {
                    tachyonService.listLeaderboard(vm.ladder.ladderId, vm.offset, vm.pageSize, vm.viewType === "myself" && vm.personaRank > 0 ? vm.personaId : "", vm.viewType === "friends" ? vm.personaId : "", vm.gameType === "benchmark", vm.filters).then(function(result) {
                        for (var i = 0; i < result.length; i++) {
                            result[i].gameType = vm.gameType;
                            result[i].category = vm.category;
                            result[i].ladderType = vm.ladder.ladderType;
                            if (result[i].matches) result[i].matchId = result[i].matches[0].matchId;
                            result[i].hasReplays = false;
                            if (result[i].dataInteger) {
                                var phcGames = result[i].dataInteger["phC-TotalGamesPlayed"];
                                var substrateGames = result[i].dataInteger["substrate-TotalGamesPlayed"];
                                if (!phcGames && !substrateGames) result[i].preferredFaction = "-";
                                else if (phcGames && !substrateGames) result[i].preferredFaction = "PHC";
                                else if (!phcGames && substrateGames) result[i].preferredFaction = "Substrate";
                                else result[i].preferredFaction = phcGames > substrateGames ? "PHC" : "Substrate";
                                result[i].hasReplays = result[i].dataInteger["replayUploadedCount"] && result[i].dataInteger["replayUploadedCount"] > 0 && result[i].dataInteger["lastReplayVersion"] && result[i].dataInteger["lastReplayVersion"] == clientVersion
                            }
                        }
                        if (newOffset < 0) {
                            var currentHeight = $("#leaderboard_one_column tbody")[0].scrollHeight;
                            var currentScrollTop = $("#leaderboard_one_column tbody").scrollTop();
                            vm.personas.unshift.apply(vm.personas, vm.personas.length > 0 && vm.personas[0].rank < vm.pageSize ? result.slice(0, vm.personas[0].rank - 1) : result);
                            vm.startReached = vm.personas.length && vm.personas[0].rank === 1;
                            $timeout(function() {
                                var newHeight = $("#leaderboard_one_column tbody")[0].scrollHeight;
                                var newScrollTop = newHeight - currentHeight + currentScrollTop;
                                $("#leaderboard_one_column tbody").scrollTop(newScrollTop);
                                vm.loading = false
                            })
                        } else if (newOffset > 0) {
                            vm.personas.push.apply(vm.personas, result);
                            vm.endReached = result.length < vm.pageSize;
                            vm.loading = false
                        } else {
                            vm.personas = result;
                            vm.startReached = vm.personas.length && vm.personas[0].rank === 1 || vm.viewType !== "myself" || vm.viewType === "myself" && vm.offset === -vm.personaRank;
                            if (vm.personaId) {
                                $timeout(function() {
                                    if (vm.personaRank && vm.personaRank <= vm.personas[vm.personas.length - 1].rank && vm.personaRank >= vm.personas[0].rank) $("#leaderboard_one_column tbody").scrollTop($('tr[data-persona-id="' + vm.personaId.toLowerCase() + '"]')[0].offsetTop - $("#leaderboard_one_column tbody").height() / 2);
                                    else $("#leaderboard_one_column tbody").scrollTop(0);
                                    vm.loading = false
                                })
                            } else {
                                vm.loading = false
                            }
                            vm.endReached = result.length < vm.pageSize
                        }
                    })
                })
            })
        }

        function getPersonaRankAsync() {
            var deferred = $q.defer();
            if (vm.personaRank > 0) deferred.resolve();
            else if (vm.personaId && vm.personaRank === -1) tachyonService.listLeaderboardsForPersona(vm.personaId).then(function(result) {
                var ladders = $filter("filter")(result, function(lb) {
                    return lb.ladderId === vm.ladder.ladderId
                });
                if (ladders.length === 1) {
                    vm.personaRank = ladders[0].rank;
                    if (vm.viewType === "myself") vm.offset = vm.personaRank < 50 ? -vm.personaRank : Math.floor(-49 / 10) * 10;
                    else vm.offset = 0
                } else {
                    if (vm.viewType === "myself") vm.leaderboardCtrl.swapToTop();
                    vm.leaderboardCtrl.disableMyself();
                    vm.personaRank = 0
                }
                return deferred.resolve()
            });
            else {
                vm.personaRank = 0;
                deferred.resolve()
            }
            return deferred.promise
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("leaderboard", {
        bindings: {
            category: "=",
            filters: "=",
            gameType: "=",
            ladderType: "=",
            matchId: "=",
            personaId: "=",
            seasonId: "=",
            viewType: "="
        },
        controller: leaderboardCtrl,
        templateUrl: "./Client/templates/archives/directives/leaderboard.html"
    });
    leaderboardCtrl.$inject = ["$q", "$state", "$filter", "$timeout", "configService", "tachyonService"];

    function leaderboardCtrl($q, $state, $filter, $timeout, configService, tachyonService) {
        var vm = this;
        vm.filteredStats = {};
        vm.filterOrder = [];
        vm.ladderTypeList = [];
        vm.possibleFilters = {};
        vm.seasonList = [];
        vm.selectedFilterIndexes = {};
        vm.selectedLadderType = {};
        vm.selectedLadderTypeIndex = 0;
        vm.selectedSeasonIndex = 0;
        vm.selectedView = {};
        vm.selectedViewIndex = 0;
        vm.showFilters = false;
        vm.showFiltersReset = false;
        vm.viewList = [];
        vm.changeCategory = changeCategory;
        vm.changeFilters = changeFilters;
        vm.changeGameType = changeGameType;
        vm.changeLadderType = changeLadderType;
        vm.changeSeason = changeSeason;
        vm.changeView = changeView;
        vm.disableMyself = disableMyself;
        vm.removeFilterKey = removeFilterKey;
        vm.resetFilters = resetFilters;
        vm.swapToTop = swapToTop;
        vm.toggleFilters = toggleFilters;
        vm.$onInit = init;

        function init() {
            populateGameTypeList();
            populateCategoryList();
            populateLadderTypeList();
            populateViewList()
        }

        function populateGameTypeList() {
            vm.gameTypeList = [{
                id: 0,
                name: $filter("resource")("single", "ladders_names"),
                gameType: "single"
            }, {
                id: 1,
                name: $filter("resource")("multi", "ladders_names"),
                gameType: "multi"
            }];
            for (var i = 0; i < vm.gameTypeList.length; i++) {
                if (vm.gameType === vm.gameTypeList[i].gameType) {
                    vm.selectedGameTypeIndex = i;
                    break
                }
            }
        }

        function populateCategoryList() {
            var categories = configService.listCategories(vm.gameType);
            vm.categoryList = [];
            for (var i = 0; i < categories.length; i++) {
                vm.categoryList.push({
                    id: i,
                    name: $filter("resource")(categories[i].category, "ladders_names"),
                    category: categories[i].category
                })
            }
            for (var i = 0; i < vm.categoryList.length; i++) {
                if (vm.category === vm.categoryList[i].category) {
                    vm.selectedCategoryIndex = i;
                    break
                }
            }
        }

        function populateLadderTypeList() {
            var deferred = $q.defer();
            if (vm.seasonId) deferred.resolve(tachyonService.listLaddersBySeasonByGameTypeByCategory(vm.seasonId, vm.gameType, vm.category));
            else deferred.resolve(tachyonService.listActiveSeasonLaddersByGameTypeByCategory(vm.gameType, vm.category));
            deferred.promise.then(function(result) {
                vm.ladders = result;
                var index = 1;
                vm.ladderTypeList = vm.ladders.map(function(ladder) {
                    return {
                        id: index++,
                        name: $filter("resource")(ladder.ladderType, "ladders_names"),
                        ladderType: ladder.ladderType,
                        ladderId: ladder.ladderId
                    }
                });
                for (var i = 0; i < vm.ladderTypeList.length; i++) {
                    if (vm.ladderType == vm.ladderTypeList[i].ladderType) {
                        vm.selectedLadderTypeIndex = i;
                        break
                    }
                }
                for (var key in vm.ladders) {
                    if (vm.ladders[key].ladderType == vm.ladderType) {
                        vm.selectedLadderType = vm.ladders[key];
                        break
                    }
                }
                populateSeasonList().then(function() {
                    populatePossibleFiltersList()
                })
            })
        }

        function populateSeasonList() {
            var deferred = $q.defer();
            if (vm.gameType === "multi") {
                tachyonService.listSeasonsByGameType(vm.gameType).then(function(result) {
                    var index = 1;
                    vm.seasonList = result.filter(function(season) {
                        return season.name.indexOf("Alpha") === -1
                    }).map(function(season) {
                        return {
                            id: index++,
                            name: season.name.replace("Ashes Multi-Player ", ""),
                            seasonId: season.seasonId,
                            isActive: season.isActive,
                            startDate: season.startDate,
                            endDate: season.endDate
                        }
                    });
                    if (vm.seasonId) {
                        for (var i = 0; i < vm.seasonList.length; i++) {
                            if (vm.seasonId == vm.seasonList[i].seasonId) {
                                vm.selectedSeasonIndex = i;
                                break
                            }
                        }
                    }
                    deferred.resolve()
                })
            } else {
                vm.seasonList = [];
                deferred.resolve()
            }
            return deferred.promise
        }

        function populateViewList() {
            var viewListNames = ["myself", "friends", "top_100"];
            for (var i = 0; i < viewListNames.length; i++) {
                vm.viewList.push({
                    id: i,
                    name: $filter("resource")(viewListNames[i], "view_names"),
                    viewType: viewListNames[i]
                })
            }
            if (vm.personaId) {
                tachyonService.getPersona(vm.personaId).then(function(result) {
                    if (result) vm.viewList[0].name = result.name
                })
            }
            if (typeof vm.viewType !== "undefined")
                for (var i = 0; i < vm.viewList.length; i++) {
                    if (vm.viewType == vm.viewList[i].viewType) {
                        vm.selectedViewIndex = i;
                        break
                    }
                }
        }

        function populatePossibleFiltersList() {
            tachyonService.listPossibleBenchmarkFilters(vm.selectedLadderType.ladderId).then(function(result) {
                if (!vm.filters || angular.equals({}, vm.filters)) vm.filteredStats = result.stats;
                var tempFilters = {};
                var tempSelectedIndexes = {};
                angular.forEach(result.filters, function(filterValues, filterKey) {
                    var index = 0;
                    tempFilters[filterKey] = [{
                        id: index++,
                        name: $filter("resource")(filterKey, "ladder_filters"),
                        sort: 1
                    }];
                    if (filterKey === "gameVersion") filterValues = filterValues.sort().reverse();
                    angular.forEach(filterValues, function(value) {
                        var add = true;
                        if (!value) add = false;
                        if (add) tempFilters[filterKey].push({
                            id: index++,
                            name: value
                        })
                    });
                    vm.filterOrder.push(filterKey);
                    if (vm.filters) vm.showFilters = true;
                    if (vm.filters && !angular.equals({}, vm.filters)) vm.showFiltersReset = true
                });
                if (!angular.equals({}, vm.filters)) {
                    angular.forEach(tempFilters, function(value, key) {
                        asyncDisableUnavailableOptions(key).then(function(processedFilterKey) {
                            vm.selectedFilterIndexes[processedFilterKey] = tempSelectedIndexes[processedFilterKey];
                            vm.possibleFilters[processedFilterKey] = tempFilters[processedFilterKey]
                        })
                    })
                } else {
                    angular.forEach(tempFilters, function(value, key) {
                        vm.selectedFilterIndexes[key] = 0;
                        vm.possibleFilters[key] = value
                    })
                }

                function asyncDisableUnavailableOptions(filterName) {
                    var deferred = $q.defer();
                    var filtersToTest = angular.extend({}, vm.filters);
                    delete filtersToTest[filterName];
                    tachyonService.listPossibleBenchmarkFilters(vm.selectedLadderType.ladderId, filtersToTest).then(function(result) {
                        var enabledList = result.filters[filterName];
                        for (var i = 1; i < tempFilters[filterName].length; i++) {
                            if (enabledList.indexOf(tempFilters[filterName][i].name) === -1) {
                                tempFilters[filterName][i].class = "disabled";
                                tempFilters[filterName][i].sort = 3
                            } else tempFilters[filterName][i].sort = 2
                        }
                        tempFilters[filterName].sort(function(a, b) {
                            if (a.sort < b.sort) return -1;
                            else if (b.sort < a.sort) return 1;
                            else {
                                if (a.id < b.id) return -1;
                                else if (b.id < a.id) return 1;
                                else return 0
                            }
                        });
                        var selectedIndex = 0;
                        if (vm.filters && vm.filters[filterName]) {
                            var specifiedValue = decodeURIComponent(vm.filters[filterName]);
                            for (var i = 0; i < tempFilters[filterName].length; i++) {
                                if (tempFilters[filterName][i].name === specifiedValue) {
                                    selectedIndex = i;
                                    break
                                }
                            }
                        }
                        tempSelectedIndexes[filterName] = selectedIndex;
                        deferred.resolve(filterName)
                    });
                    return deferred.promise
                }
            });
            if (vm.filters && !angular.equals({}, vm.filters)) tachyonService.listPossibleBenchmarkFilters(vm.selectedLadderType.ladderId, vm.filters).then(function(result) {
                vm.filteredStats = result.stats
            })
        }

        function changeGameType() {
            if (vm.gameTypeList[vm.selectedGameTypeIndex].gameType != vm.gameType) {
                var gameType = vm.gameTypeList[vm.selectedGameTypeIndex].gameType;
                var category = configService.getDefaultCategory(gameType);
                var ladderType = configService.getDefaultLadderType(gameType, category);
                return $state.go("root.ladders", {
                    gameType: gameType,
                    category: category,
                    ladderType: ladderType,
                    seasonId: null
                }, {
                    location: true,
                    inherit: true
                })
            }
        }

        function changeCategory() {
            if (vm.categoryList[vm.selectedCategoryIndex].category != vm.category) {
                var category = vm.categoryList[vm.selectedCategoryIndex].category;
                var ladderType = configService.getDefaultLadderType(vm.gameType, category);
                $state.go("root.ladders", {
                    gameType: vm.gameType,
                    category: category,
                    ladderType: ladderType,
                    seasonId: null
                })
            }
        }

        function changeLadderType() {
            if (vm.ladderTypeList[vm.selectedLadderTypeIndex].ladderType != vm.ladderType) {
                var ladderType = vm.ladderTypeList[vm.selectedLadderTypeIndex].ladderType;
                vm.ladderTypeList = [];
                $state.go("root.ladders", {
                    gameType: vm.gameType,
                    category: vm.category,
                    ladderType: ladderType,
                    seasonId: null
                })
            }
        }

        function changeSeason() {
            if (vm.seasonList[vm.selectedSeasonIndex].seasonId != vm.seasonId) {
                var seasonId = vm.seasonList[vm.selectedSeasonIndex].seasonId;
                $state.go("root.ladders", {
                    seasonId: seasonId
                })
            }
        }

        function changeView() {
            if (vm.viewList[vm.selectedViewIndex].viewType != vm.viewType && vm.viewList[vm.selectedViewIndex].viewType != "myself_na") {
                $state.go("root.ladders", {
                    viewType: vm.viewList[vm.selectedViewIndex].viewType
                })
            }
        }

        function changeFilters(filterKey) {
            var filters = {};
            angular.forEach(vm.selectedFilterIndexes, function(value, key) {
                if (vm.possibleFilters[key][value].id > 0) filters[key] = vm.possibleFilters[key][value].name
            });
            if (!angular.equals(filters, vm.filters)) $state.go("root.ladders", {
                filters: angular.toJson(filters)
            })
        }

        function removeFilterKey(filterKey) {
            vm.selectedFilterIndexes[filterKey] = 0;
            changeFilters(filterKey)
        }

        function resetFilters() {
            $state.go("root.ladders", {
                filters: angular.toJson({})
            })
        }

        function toggleFilters() {
            if (vm.showFilters) $state.go("root.ladders", {
                filters: ""
            });
            vm.showFilters = !vm.showFilters
        }

        function disableMyself() {
            vm.viewList[0].name = $filter("resource")("myself_na", "view_names")
        }

        function swapToTop() {
            $("#viewType > a").text($filter("resource")("top_100", "view_names"))
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("mainNav", {
        controller: mainNavCtrl,
        templateUrl: "./Client/templates/archives/directives/main-nav.html"
    });
    mainNavCtrl.$inject = ["$location", "configService"];

    function mainNavCtrl($location, configService) {
        var vm = this;
        vm.personaId = "";
        vm.productId = configService.getProductId();
        vm.getClass = getClass;
        vm.$onInit = init;

        function init() {
            var currentUser = configService.getCurrentUser();
            if (typeof currentUser !== "undefined") vm.personaId = currentUser.personaId
        }

        function getClass(path) {
            if (path.substring(0, 1) == "*" && path.substring(-1, 1) == "*" && $location.path().indexOf(path.substring(1, path.length - 1)) > -1) {
                return "active"
            } else if (path.substring(0, 1) == "*" && $location.path().endsWith(path.substring(1))) {
                return "active"
            } else if ($location.path().substr(0, path.length) === path) {
                return "active"
            } else {
                return ""
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("matchDetailsBenchmark", {
        bindings: {
            matchId: "="
        },
        controller: matchDetailsBenchmarkCtrl,
        templateUrl: "./Client/templates/archives/directives/match-details-benchmark.html"
    });
    matchDetailsBenchmarkCtrl.$inject = ["$filter", "configService", "tachyonService"];

    function matchDetailsBenchmarkCtrl($filter, configService, tachyonService) {
        var vm = this;
        vm.ladders = [];
        vm.loading = true;
        vm.match = {};
        vm.$onInit = init;

        function init() {
            tachyonService.getMatch(vm.matchId).then(function(result) {
                vm.match = result;
                tachyonService.listLeaderboardsForPersona(vm.match.participants[0].personaId).then(function(result) {
                    var ladders = result;
                    for (var i = 0; i < ladders.length; i++) {
                        ladders[i].gameType = configService.getGameTypeName(ladders[i].ladderType);
                        ladders[i].category = configService.getCategoryName(ladders[i].ladderType);
                        ladders[i].enabled = true
                    }
                    vm.ladders = $filter("filter")(ladders, function(l) {
                        return l.gameType === "benchmark"
                    });
                    vm.loading = false
                })
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("matchDetails", {
        bindings: {
            personaId: "=",
            matchId: "="
        },
        templateUrl: "./Client/templates/archives/directives/match-details.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("matchHistory", {
        bindings: {
            personaId: "=",
            ladderId: "="
        },
        controller: matchHistoryCtrl,
        templateUrl: "./Client/templates/archives/directives/match-history.html"
    });
    matchHistoryCtrl.$inject = ["$filter", "$state", "configService", "tachyonService"];

    function matchHistoryCtrl($filter, $state, configService, tachyonService) {
        var vm = this;
        vm.columnSet = [];
        vm.filteredMatches = [];
        vm.gameTypeList = [];
        vm.loading = true;
        vm.matches = [];
        vm.selectedGameType = "";
        vm.selectedGameTypeIndex = 0;
        vm.totalMatches = 0;
        vm.changeGameType = changeGameType;
        vm.goToMatchDetails = goToMatchDetails;
        vm.$onInit = init;

        function init() {
            loadMatches()
        }

        function loadGameTypeSelectionBox() {
            var output = [];
            var flags = [];
            for (var i = 0; i < vm.matches.length; i++) {
                if (!vm.matches[i].dataString || !vm.matches[i].dataString["type"]) continue;
                if (flags[vm.matches[i].dataString["type"]]) continue;
                flags[vm.matches[i].dataString["type"]] = true;
                output.push({
                    type: vm.matches[i].dataString["type"],
                    name: $filter("resource")(vm.matches[i].dataString["type"], "ladders_names_short")
                })
            }
            output.sort(function(a, b) {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0
            });
            var index = 1;
            vm.gameTypeList.push({
                id: index,
                name: $filter("resource")("all_matches", "misc"),
                type: ""
            });
            angular.forEach(output, function(value) {
                vm.gameTypeList.push({
                    id: ++index,
                    name: value.name,
                    type: value.type
                })
            })
        }

        function loadMatches(offset) {
            tachyonService.listMatches(vm.personaId, vm.offset).then(function(result) {
                vm.totalMatches = result.count;
                var matches = [];
                vm.columnSet = configService.getMatchHistoryColumnSet("");
                angular.forEach(result.data, function(match) {
                    match.persona = $filter("filter")(match.participants, function(p) {
                        return p.personaId == vm.personaId.toLowerCase()
                    })[0];
                    match.expandable = vm.columnSet.detailColumns.length && match.dataString && (match.dataString.type && match.dataString.type.toLowerCase() !== "benchmark");
                    if (match.matchStateId === 6) matches.push(match)
                });
                vm.matches = vm.filteredMatches = matches;
                var versionToCompare = 0;
                tachyonService.getGameVersion().then(function(versionResult) {
                    versionToCompare = versionResult.version;
                    tachyonService.listStorage(vm.personaId, "", "Replay").then(function(storageResult) {
                        if (storageResult.length > 0) {
                            angular.forEach(vm.matches, function(match) {
                                if (versionToCompare.indexOf(match.version) == 0) {
                                    var storageItem = $filter("filter")(storageResult, {
                                        matchId: match.matchId
                                    });
                                    if (storageItem.length > 0) match.replayStorageInfo = storageItem[0]
                                }
                            })
                        }
                    })
                });
                loadGameTypeSelectionBox();
                vm.loading = false
            })
        }

        function goToMatchDetails(match) {
            if (match.dataString && match.dataString.gametype === "benchmark") $state.go("root.persona.matchDetails", {
                personaId: match.persona.personaId,
                matchId: match.matchId
            });
            else match.showDetails = !match.showDetails
        }

        function changeGameType() {
            vm.selectedGameType = vm.gameTypeList[vm.selectedGameTypeIndex].type;
            vm.columnSet = configService.getMatchHistoryColumnSet(vm.selectedGameType);
            vm.filteredMatches = $filter("filter")(vm.matches, {
                dataString: {
                    type: vm.selectedGameType
                }
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("opponentColumn", {
        bindings: {
            record: "="
        },
        templateUrl: "./Client/templates/archives/directives/opponent-column.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("personaColumn", {
        bindings: {
            record: "="
        },
        templateUrl: "./Client/templates/archives/directives/persona-column.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("personaInfo", {
        bindings: {
            loggedInPersonaId: "=",
            personaId: "="
        },
        controller: personaInfoCtrl,
        templateUrl: "./Client/templates/archives/directives/persona-info.html"
    });
    personaInfoCtrl.$inject = ["$http", "tachyonService"];

    function personaInfoCtrl($http, tachyonService) {
        var vm = this;
        vm.friendStatus = 0;
        vm.loggedInPersona = {};
        vm.persona = {};
        vm.personaFullyLoaded = false;
        vm.rankedBracketId = 10;
        vm.rank = 0;
        vm.addFriend = addFriend;
        vm.$onInit = init;

        function init() {
            loadPersona()
        }

        function loadPersona() {
            tachyonService.getPersona(vm.personaId).then(function(result) {
                vm.persona = result;
                tachyonService.listLeaderboardsForPersona(vm.personaId).then(function(result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].ladderType == "Ranked") {
                            vm.rankedBracketId = result[i].bracketId;
                            vm.rank = result[i].rank;
                            break
                        }
                    }
                    vm.personaFullyLoaded = true
                }, function(error) {});
                if (vm.persona.providerTypeId === 2 && vm.loggedInPersonaId) loadLoggedInPersona()
            }, function(error) {})
        }

        function loadLoggedInPersona() {
            if (vm.personaId.toLowerCase() === vm.loggedInPersonaId.toLowerCase()) return;
            tachyonService.getPersona(vm.loggedInPersonaId).then(function(result) {
                vm.loggedInPersona = result;
                if (vm.loggedInPersona.providerTypeId === 2) {
                    tachyonService.listFriends(vm.loggedInPersona.profileId).then(function(result) {
                        for (var i = 0; i < result.friends.length; i++) {
                            if (result.friends[i].personaId.toLowerCase() == vm.personaId.toLowerCase()) {
                                vm.friendStatus = 2;
                                break
                            }
                        }
                        if (vm.friendStatus === 0) vm.friendStatus = 1
                    }, function(error) {})
                }
            }, function(error) {})
        }

        function addFriend() {
            $http.get("tachyon://ashes/addfriend/" + (vm.persona.providerTypeId === 2 ? "steam" : "gog") + "/" + vm.persona.providerId)
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").directive("preventDefault", preventDefault);

    function preventDefault() {
        return function(scope, element, attrs) {
            angular.element(element).bind("click", function(event) {
                event.preventDefault();
                event.stopPropagation()
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("rankColumn", {
        bindings: {
            record: "="
        },
        templateUrl: "./Client/templates/archives/directives/rank-column.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("ratingColumn", {
        bindings: {
            record: "="
        },
        controller: ratingColumnCtrl,
        templateUrl: "./Client/templates/archives/directives/rating-column.html"
    });

    function ratingColumnCtrl() {
        var vm = this;
        vm.getNumber = getNumber;

        function getNumber(num) {
            return new Array(num)
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("replayColumn", {
        bindings: {
            storageId: "=",
            duration: "=",
            map: "="
        },
        controller: replayColumnCtrl,
        templateUrl: "./Client/templates/archives/directives/replay-column.html"
    });
    replayColumnCtrl.$inject = ["$http"];

    function replayColumnCtrl($http) {
        var vm = this;
        vm.viewReplay = viewReplay;

        function viewReplay(e) {
            e.stopPropagation();
            $http.get("tachyon://escalation/viewreplay/" + vm.storageId)
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("replayPersonaColumn", {
        bindings: {
            avatarUrl: "=",
            personaName: "="
        },
        templateUrl: "./Client/templates/archives/directives/replay-persona-column.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("replayRankColumn", {
        bindings: {
            bracketId: "=",
            rank: "="
        },
        templateUrl: "./Client/templates/archives/directives/replay-rank-column.html"
    })
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").component("search", {
        bindings: {
            personaId: "="
        },
        controller: searchCtrl,
        templateUrl: "./Client/templates/archives/directives/search.html"
    });
    searchCtrl.$inject = ["$state", "tachyonService"];

    function searchCtrl($state, tachyonService) {
        var vm = this;
        vm.isProcessing = false;
        vm.matches = [];
        vm.resultEnum = Object.freeze({
            unknown: -1,
            success: 0,
            noMatches: 1,
            errorOccured: 2,
            emptySearch: 3
        });
        vm.result = this.resultEnum.unknown;
        vm.searchText = "";
        vm.performSearch = performSearch;
        vm.processSearchText = processSearchText;
        vm.selectPlayer = selectPlayer;

        function performSearch() {
            if (vm.searchText != "" && !vm.isProcessing) {
                vm.isProcessing = true;
                tachyonService.listPersonas(vm.searchText).then(function(result) {
                    if (result.length == 1) {
                        vm.result = vm.resultEnum.success;
                        vm.selectPlayer(result[0].personaId)
                    } else if (result.length > 1) {
                        vm.result = vm.resultEnum.success;
                        vm.matches = result
                    } else {
                        vm.result = vm.resultEnum.noMatches
                    }
                }, function(result) {
                    vm.result = vm.resultEnum.errorOccured
                })
            } else if (vm.searchText == "") {
                vm.result = vm.resultEnum.emptySearch
            }
            vm.isProcessing = false
        }

        function selectPlayer(personaId) {
            vm.result = vm.result.unknown;
            vm.matches = [];
            vm.searchText = "";
            return $state.go("root.persona.summary", {
                personaId: personaId,
                ladderId: "x"
            }, {
                location: true,
                inherit: true
            })
        }

        function processSearchText(e) {
            if (e.which == 10 || e.which == 13) {
                e.preventDefault();
                e.target.blur();
                vm.performSearch()
            } else {
                vm.result = vm.resultEnum.unknown
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("laddersCtrl", laddersCtrl);
    laddersCtrl.$inject = ["$stateParams", "$state", "$filter", "configService"];

    function laddersCtrl($stateParams, $state, $filter, configService) {
        var vm = this;
        vm.category = $stateParams["category"];
        vm.filters = angular.fromJson($stateParams["filters"]);
        vm.gameType = $stateParams["gameType"];
        vm.ladderType = $stateParams["ladderType"];
        vm.personaId = $stateParams["personaId"];
        vm.seasonId = $stateParams["seasonId"];
        vm.valid = false;
        vm.viewType = $stateParams["viewType"];
        activate();

        function activate() {
            validateInput()
        }

        function validateInput() {
            var redirect = false;
            var lastState = {
                gameType: window.localStorage.getItem("gameType")
            };
            if (!vm.gameType || configService.listGameTypeNames().indexOf(vm.gameType) == -1) {
                if (lastState.gameType && lastState.gameType !== "benchmark") vm.gameType = lastState.gameType;
                else vm.gameType = "multi";
                redirect = true
            }
            angular.extend(lastState, {
                category: window.localStorage.getItem("category-" + vm.gameType),
                ladderType: window.localStorage.getItem("ladderType-" + vm.gameType),
                viewType: window.localStorage.getItem("viewType-" + vm.gameType)
            });
            if (!vm.category || configService.listCategoryNames(vm.gameType).indexOf(vm.category) == -1) {
                if (lastState.category && configService.listCategoryNames(vm.gameType).indexOf(lastState.category) > -1) {
                    vm.category = lastState.category;
                    vm.ladderType = lastState.ladderType
                } else vm.category = configService.getDefaultCategory(vm.gameType);
                redirect = true
            }
            if (!vm.ladderType || configService.listLadderTypeNames(vm.gameType, vm.category).indexOf(vm.ladderType) == -1) {
                vm.ladderType = configService.getDefaultLadderType(vm.gameType, vm.category);
                redirect = true
            }
            if (!vm.viewType) {
                if (lastState.viewType && lastState.viewType !== "myself") {
                    vm.viewType = lastState.viewType;
                    redirect = true
                } else {
                    vm.viewType = "myself"
                }
            }
            if (redirect) $state.go("root.ladders", {
                gameType: vm.gameType,
                category: vm.category,
                ladderType: vm.ladderType,
                personaId: vm.personaId,
                viewType: vm.viewType
            });
            else {
                window.localStorage.setItem("gameType", vm.gameType);
                window.localStorage.setItem("category-" + vm.gameType, vm.category);
                window.localStorage.setItem("ladderType-" + vm.gameType, vm.ladderType);
                window.localStorage.setItem("viewType-" + vm.gameType, vm.viewType);
                vm.valid = true
            }
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("personaCtrl", personaCtrl);
    personaCtrl.$inject = ["$stateParams"];

    function personaCtrl($stateParams) {
        var vm = this;
        vm.loggedInPersonaId = $stateParams.loggedInPersonaId;
        vm.personaId = $stateParams.personaId
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("personaHallOfFameCtrl", personaHallOfFameCtrl);
    personaHallOfFameCtrl.$inject = ["$state", "$stateParams", "$q", "$filter", "configService", "tachyonService"];

    function personaHallOfFameCtrl($state, $stateParams, $q, $filter, configService, tachyonService) {
        var vm = this;
        vm.categoryList = [];
        vm.columnSet = [];
        vm.filteredMatches = [];
        vm.ladder = {};
        vm.ladders = [];
        vm.ladderType = $stateParams.ladderType;
        vm.loading = true;
        vm.personaId = $stateParams.personaId;
        vm.selectedCategory = $stateParams.category;
        vm.selectedCategoryIndex = 0;
        vm.totalMatches = 0;
        vm.changeCategory = changeCategory;
        vm.goToMatchDetails = goToMatchDetails;
        activate();

        function activate() {
            populateLadders();
            populateCategories()
        }

        function populateCategories() {
            vm.categoryList = [{
                id: 0,
                name: $filter("resource")("campaign_1", "ladders_names"),
                category: "campaign_1"
            }, {
                id: 1,
                name: $filter("resource")("campaign_1.5", "ladders_names"),
                category: "campaign_1.5"
            }, {
                id: 2,
                name: $filter("resource")("campaign_2", "ladders_names"),
                category: "campaign_2"
            }, {
                id: 3,
                name: $filter("resource")("campaign_3", "ladders_names"),
                category: "campaign_3"
            }, {
                id: 4,
                name: $filter("resource")("scenarios", "ladders_names"),
                category: "scenario"
            }];
            vm.selectedCategoryIndex = $filter("filter")(vm.categoryList, {
                category: vm.selectedCategory
            })[0].id
        }

        function populateLadders() {
            asyncPopulateLadderList().then(function() {
                angular.forEach(vm.ladders, function(ladder) {
                    tachyonService.listLeaderboardsForPersona(vm.personaId).then(function(result) {
                        var personaLadders = result;
                        var scenarioLadders = {};
                        for (var i = 0; i < personaLadders.length; i++) {
                            personaLadders[i].gameType = configService.getGameTypeName(personaLadders[i].ladderType);
                            personaLadders[i].category = configService.getCategoryName(personaLadders[i].ladderType);
                            if (personaLadders[i].category && (personaLadders[i].category === "scenario" || personaLadders[i].category.indexOf("campaign") === 0)) scenarioLadders[personaLadders[i].ladderType] = personaLadders[i]
                        }
                        angular.forEach(vm.ladders, function(value, index) {
                            value.personaLadder = scenarioLadders[value.ladderType]
                        })
                    })
                });
                if (vm.ladderType) populateDetails()
            })
        }

        function asyncPopulateLadderList() {
            var deferred = $q.defer();
            var completedOperations = 0;

            function checkIfFinished() {
                completedOperations++;
                if (completedOperations == 1) deferred.resolve()
            }
            tachyonService.listActiveSeasonLaddersByGameTypeByCategory("single").then(function(result) {
                angular.forEach(result, function(value, index) {
                    value.category = configService.getCategoryName(value.ladderType)
                });
                Array.prototype.unshift.apply(vm.ladders, result);
                checkIfFinished()
            });
            return deferred.promise
        }

        function populateDetails() {
            vm.ladder = $filter("filter")(vm.ladders, {
                ladderType: vm.ladderType
            })[0];
            if (vm.ladder) {
                tachyonService.listLeaderboard(vm.ladder.ladderId, 0, 100, null, vm.personaId, true).then(function(result) {
                    vm.ladder.leaderboard = result
                }, function(response) {
                    if (response.status === 404) {}
                });
                loadMatches()
            }
        }

        function loadMatches(offset) {
            tachyonService.listMatches(vm.personaId, vm.offset).then(function(result) {
                vm.totalMatches = result.count;
                var matches = [];
                vm.columnSet = configService.getMatchHistoryColumnSet("hof");
                angular.forEach(result.data, function(match) {
                    match.persona = $filter("filter")(match.participants, function(p) {
                        return p.personaId == vm.personaId.toLowerCase()
                    })[0];
                    match.expandable = vm.columnSet.detailColumns.length && match.dataString && match.dataString.type !== "benchmark";
                    if (match.matchStateId === 6) matches.push(match)
                });
                var filter = {};
                if (vm.ladderType.indexOf("C1.5.") === 0) {
                    filter = {
                        dataString: {
                            "x-CampaignName": "Campaign_1.5",
                            "x-Scenario": vm.ladderType.substring(5)
                        }
                    }
                } else if (vm.ladderType.indexOf("C2.") === 0) {
                    filter = {
                        dataString: {
                            "x-CampaignName": "Campaign_2",
                            "x-Scenario": vm.ladderType.substring(3)
                        }
                    }
                } else if (vm.ladderType.indexOf("C1.") === 0) {
                    filter = {
                        dataString: {
                            "x-CampaignName": "Campaign_1",
                            "x-Scenario": vm.ladderType.substring(3)
                        }
                    }
                } else if (vm.ladderType.indexOf("C3.") === 0) {
                    filter = {
                        dataString: {
                            "x-CampaignName": "Campaign_3",
                            "x-Scenario": vm.ladderType.substring(3)
                        }
                    }
                } else if (vm.ladderType.indexOf("Scenario_") === 0) {
                    filter = {
                        dataString: {
                            "map-name": vm.ladderType.substring(9)
                        }
                    }
                }
                vm.filteredMatches = $filter("filter")(matches, filter);
                vm.loading = false
            })
        }

        function goToMatchDetails(match) {
            if (match.dataString && match.dataString.gametype === "benchmark") $state.go("root.persona.matchDetails", {
                personaId: match.persona.personaId,
                matchId: match.matchId
            });
            else match.showDetails = !match.showDetails
        }

        function changeCategory() {
            $state.go("root.persona.hallOfFame", {
                category: vm.categoryList[vm.selectedCategoryIndex].category
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("personaMatchDetailsCtrl", personaMatchDetailsCtrl);
    personaMatchDetailsCtrl.$inject = ["$state", "$stateParams", "$filter", "tachyonService"];

    function personaMatchDetailsCtrl($state, $stateParams, $filter, tachyonService) {
        var vm = this;
        vm.loading = true;
        vm.match = null;
        vm.matchId = $stateParams.matchId;
        vm.matchList = [];
        vm.personaId = $stateParams.personaId;
        vm.selectedMatchIndex = 0;
        vm.changeMatch = changeMatch;
        activate();

        function activate() {
            loadMatchList()
        }

        function changeMatch() {
            return $state.go("root.persona.matchDetails", {
                matchId: vm.matchList[vm.selectedMatchIndex].matchId
            }, {
                location: true,
                inherit: true
            })
        }

        function loadMatch(offset) {
            tachyonService.getMatch(vm.matchId).then(function(result) {
                vm.match = result;
                vm.loading = false
            })
        }

        function loadMatchList() {
            tachyonService.listMatches(vm.personaId, 0).then(function(result) {
                var matches = $filter("filter")(result.data, function(m) {
                    return m.dataString && m.dataString["gametype"] === "benchmark"
                });
                for (var i = 0; i < matches.length; i++) {
                    var type = matches[i].dataString["x-Preset"] ? $filter("resource")(matches[i].dataString["x-Preset"], "ladders_names") : "Other";
                    var matchName = type + " on " + $filter("amDateFormat")(matches[i].createDate, "YYYY-MM-DD HH:mm:ss");
                    if (matches[i].matchId.toLowerCase() === vm.matchId.toLowerCase()) {
                        vm.selectedMatchIndex = i;
                        matchName += " *"
                    }
                    vm.matchList.push({
                        id: i,
                        name: matchName,
                        matchId: matches[i].matchId
                    })
                }
                if (vm.matchId) loadMatch();
                else if (vm.matchList.length) $state.go("root.persona.matchDetails", {
                    matchId: vm.matchList[0].matchId
                }, {
                    location: true,
                    inherit: true
                });
                else vm.loading = false
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("personaMatchHistoryCtrl", personaMatchHistoryCtrl);
    personaMatchHistoryCtrl.$inject = ["$stateParams"];

    function personaMatchHistoryCtrl($stateParams) {
        var vm = this;
        vm.personaId = $stateParams.personaId
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("personaSummaryCtrl", personaSummaryCtrl);
    personaSummaryCtrl.$inject = ["$stateParams", "$filter", "configService", "tachyonService"];

    function personaSummaryCtrl($stateParams, $filter, configService, tachyonService) {
        var vm = this;
        vm.aiFaction = "";
        vm.charts = {};
        vm.graphTab = $stateParams.graphTab || "faction";
        vm.graphType = $stateParams.graphType || "single";
        vm.isAI = false;
        vm.ladderId = $stateParams.ladderId;
        vm.ladders = [];
        vm.persona = {};
        vm.personaId = $stateParams.personaId;
        vm.stats = {
            MP_Aggregate_Stats: {},
            MP_PHC_Wins: 0,
            MP_PHC_Win_Percentage: 0,
            MP_Substrate_Wins: 0,
            MP_Substrate_Win_Percentage: 0,
            MP_Matches_Played: 0,
            SP_Aggregate_Stats: {},
            SP_PHC_Wins: 0,
            SP_PHC_Win_Percentage: 0,
            SP_Substrate_Wins: 0,
            SP_Substrate_Win_Percentage: 0,
            SP_Matches_Played: 0
        };
        activate();

        function activate() {
            loadPersona();
            loadPersonaLeaderboards()
        }

        function loadPersona() {
            tachyonService.getPersona(vm.personaId).then(function(result) {
                vm.persona = result
            }, function(error) {})
        }

        function loadPersonaLeaderboards() {
            tachyonService.listAggregateStatsByPersona(vm.personaId).then(function(result) {
                vm.aggregateStats = [];
                for (var i = 0; i < result.length; i++) {
                    vm.aggregateStats[result[i].key] = result[i]
                }
            }, function(error) {});
            tachyonService.listAI().then(function(aiPlayers) {
                var matchedAiPlayers = aiPlayers.filter(function(ai) {
                    return ai.personaId == vm.personaId.toUpperCase()
                });
                if (matchedAiPlayers.length > 0) {
                    vm.aiFaction = matchedAiPlayers[0].faction;
                    vm.isAI = true
                }
            });
            tachyonService.listLeaderboardsForPersona(vm.personaId).then(function(result) {
                vm.ladders = result;
                for (var i = 0; i < vm.ladders.length; i++) {
                    vm.ladders[i].gameType = configService.getGameTypeName(vm.ladders[i].ladderType);
                    vm.ladders[i].category = configService.getCategoryName(vm.ladders[i].ladderType);
                    vm.ladders[i].enabled = true;
                    vm.ladders[i].visible = vm.ladders[i].category !== "campaign" && vm.ladders[i].category !== "scenario";
                    var ladder = vm.ladders[i];
                    switch (ladder.ladderType) {
                        case "PHC":
                        case "MP_PHC":
                        case "Substrate":
                        case "MP_Substrate":
                            var propertyName = ladder.ladderType.indexOf("MP_") === 0 ? ladder.ladderType : "SP_" + ladder.ladderType;
                            vm.stats[propertyName + "_Wins"] = ladder.wins;
                            vm.stats[propertyName + "_Win_Percentage"] = ladder.wins / (ladder.wins + ladder.losses + ladder.ties) * 100;
                            break;
                        case "SinglePlayerOverall":
                        case "Ranked":
                            var propertyPrefix = ladder.ladderType === "Ranked" ? "MP_" : "SP_";
                            (function(propertyPrefix) {
                                tachyonService.listAggregateStatsByPersonaLadder(ladder.personaLadderId).then(function(result) {
                                    for (var i = 0; i < result.length; i++) {
                                        vm.stats[propertyPrefix + "Aggregate_Stats"][result[i].key.trim()] = result[i].value
                                    }
                                }, function(error) {})
                            })(propertyPrefix);
                            if (propertyPrefix == "MP_" && vm.isAI) {
                                vm.stats["MP_" + vm.aiFaction + "_Wins"] = ladder.wins;
                                vm.stats["MP_" + vm.aiFaction + "_Win_Percentage"] = ladder.wins / (ladder.wins + ladder.losses + ladder.ties) * 100
                            }
                            vm.stats[propertyPrefix + "Matches_Played"] = ladder.totalMatchesPlayed;
                            break
                    }
                }
                calculateCharts()
            }, function(error) {})
        }

        function calculateCharts() {
            Chart.defaults.global.defaultFontColor = "#3CA6B9";
            vm.chartDefaultOptions = {
                legend: {
                    display: true,
                    position: "bottom"
                },
                title: {
                    display: true,
                    text: ""
                }
            };
            calculateFactionWinsChartData();
            calculateMapChartData()
        }

        function calculateFactionWinsChartData() {
            vm.charts["SP_Faction"] = {};
            vm.charts["MP_Faction"] = {};
            vm.charts["SP_Faction"].labels = ["PHC", "Substrate"];
            vm.charts["SP_Faction"].data = [vm.stats["SP_PHC_Wins"], vm.stats["SP_Substrate_Wins"]];
            vm.charts["MP_Faction"].data = [vm.stats["MP_PHC_Wins"], vm.stats["MP_Substrate_Wins"]];
            vm.charts["SP_Faction"].options = angular.merge({}, vm.chartDefaultOptions, {
                title: {
                    text: $filter("resource")("SP_Faction", "chart_labels")
                }
            });
            vm.charts["MP_Faction"].options = angular.merge({}, vm.chartDefaultOptions, {
                title: {
                    text: $filter("resource")("MP_Faction", "chart_labels")
                }
            })
        }

        function calculateMapChartData() {
            tachyonService.listMatches(vm.personaId).then(function(matches) {
                var tempMapData = {
                    MP_MapNameRecords: {},
                    SP_MapNameRecords: {},
                    MP_MapSizeRecords: {},
                    SP_MapSizeRecords: {}
                };
                for (var i = 0; i < matches.data.length; i++) {
                    var match = matches.data[i];
                    var chart_prefix = "";
                    var record_chart_key = "";
                    if (!match.dataString) continue;
                    switch (match.dataString["gametype"]) {
                        case "multi":
                            chart_prefix = "MP_";
                            break;
                        case "single":
                            chart_prefix = "SP_";
                            break
                    }
                    if (chart_prefix === "") continue;
                    if (typeof tempMapData[chart_prefix + "MapNameRecords"][match.dataString["map-name"]] == "undefined") tempMapData[chart_prefix + "MapNameRecords"][match.dataString["map-name"]] = {
                        losses: 0,
                        wins: 0
                    };
                    if (typeof tempMapData[chart_prefix + "MapSizeRecords"][match.dataString["map-size"]] == "undefined") tempMapData[chart_prefix + "MapSizeRecords"][match.dataString["map-size"]] = {
                        losses: 0,
                        wins: 0
                    };
                    var participant = match.participants.filter(function(p) {
                        return p.personaId.toUpperCase() == vm.personaId.toUpperCase()
                    })[0];
                    if (!participant) continue;
                    var result = participant.dataInteger["result"];
                    if (!result) continue;
                    switch (result) {
                        case -1:
                            tempMapData[chart_prefix + "MapNameRecords"][match.dataString["map-name"]].losses++;
                            tempMapData[chart_prefix + "MapSizeRecords"][match.dataString["map-size"]].losses++;
                            break;
                        case 1:
                            tempMapData[chart_prefix + "MapNameRecords"][match.dataString["map-name"]].wins++;
                            tempMapData[chart_prefix + "MapSizeRecords"][match.dataString["map-size"]].wins++;
                            break
                    }
                }
                var sortedChartData = {};
                angular.forEach(tempMapData, function(item, index) {
                    var sortable = [];
                    for (var map in item) sortable.push([map, item[map]]);
                    sortable.sort(function(a, b) {
                        return b[1].wins - a[1].wins
                    });
                    sortedChartData[index] = sortable
                });
                angular.forEach(sortedChartData, function(item, index) {
                    var data = {
                        data: [
                            [],
                            []
                        ],
                        dataset: {},
                        labels: [],
                        series: ["Wins", "Losses"],
                        colors: [{
                            backgroundColor: "rgba(151,187,205,1)"
                        }, {
                            backgroundColor: "rgba(220,220,220,1)"
                        }],
                        options: {
                            maintainAspectRatio: false
                        }
                    };
                    var i = 0;
                    angular.forEach(item, function(item, index) {
                        i++;
                        if (i <= 7) {
                            if (item[1].wins) {
                                data.data[0].push(item[1].wins);
                                data.data[1].push(item[1].losses);
                                data.labels.push(item[0])
                            }
                        }
                    });
                    data.options = angular.merge({}, vm.chartDefaultOptions, {
                        title: {
                            text: $filter("resource")(index, "chart_labels")
                        }
                    });
                    vm.charts[index] = data
                })
            })
        }
    }
})(window.angular);
(function(angular) {
    angular.module("LeaderBoardApp").controller("replaysCtrl", replaysCtrl);
    replaysCtrl.$inject = ["$stateParams", "$state", "$filter", "configService", "tachyonService"];

    function replaysCtrl($stateParams, $state, $filter, configService, tachyonService) {
        var vm = this;
        vm.columnSet = [];
        vm.loading = false;
        vm.replays = [];
        activate();

        function activate() {
            vm.loading = true;
            vm.columnSet = configService.getReplaysColumnSet();
            var clientVersion = 0;
            tachyonService.getGameVersion().then(function(ver) {
                clientVersion = ver.version;
                tachyonService.listReplays("ranked", clientVersion).then(function(result) {
                    vm.replays = result;
                    vm.loading = false
                })
            })
        }
    }
})(window.angular);