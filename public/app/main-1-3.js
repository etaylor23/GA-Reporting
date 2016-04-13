var app = angular.module("weatherCharting", ['angularDc']);

app.controller('mainDashboard', function($scope, $http) {
  	// in the controller, we only keep data modeling (or better, delegate to a service)

    $http.get('/data')
      .then(function successCallback(response) {

        debugger;

      			function print_filter(filter){
      				var f=eval(filter);
      				if (typeof(f.length) != "undefined") {}else{}
      				if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
      				if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
      				console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
      			}


            $scope.dataReal = data.rows;

      			$scope.ndxReal = crossfilter($scope.dataReal);

      			//var parseDate = d3.time.format("%m/%d/%Y").parse;
      			var parseDateReal = d3.time.format("%Y%m%d").parse;

      			dataReal.forEach(function(d) {
      				d[0] = parseDateReal(d[0]);
      			})

      			print_filter("dataReal");

      			var dateDimReal = ndxReal.dimension(function(d) {return d[0];})
      			var hitsReal = dateDimReal.group().reduceSum(dc.pluck([1]));
      			var minDateReal = dateDimReal.bottom(1)[0][0];
      			var maxDateReal = dateDimReal.top(1)[0][0];
      			var hitsLineChartReal = dc.lineChart("#chart-line-hitsperdayreal")
      			var bounces=dateDimReal.group().reduceSum(function(d) {return d[3];});

/*
      			hitsLineChartReal
      				.width(650).height(350)
      				.dimension(dateDimReal)
      				.group(hitsReal, "Hits")
      				.stack(bounces, "Bounces")
      				.x(d3.time.scale().domain([minDateReal,maxDateReal]))
      				.renderArea(true)
      				//.brushOn(false)
      				.xAxisLabel("Last 2 Months")
      				.yAxisLabel("Total Page Views")
      				.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
      			    .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"]);
*/

      			dataReal.forEach(function(d) {
      				//d[0] = new Date();
      				//d.date = parseDate(d.date);
      				//d.total= d.http_404+d.http_200+d.http_302;
      					var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      			        d[4]=monthNames[d[0].getMonth()];
      			        console.log(d[4])
      			});

      			var yearRingChart   = dc.pieChart("#chart-ring-year");
      			$scope.yearDim  = ndxReal.dimension(function(d) {return d[4];});
      			$scope.year_total = $scope.yearDim.group().reduceSum(function(d) {return d[1];});

/*
      			yearRingChart
      			    .width(350).height(350)
      			    .dimension($scope.yearDim)
      			    .group($scope.year_total)
      			    .innerRadius(80)
      			    .ordinalColors(["#1d1847","#28a0c7","#6c6998","#ffcb31","#f05a3f","#00a481"])
      			    .legend(dc.legend().x(150).y(150).itemHeight(13).gap(5))
*/

      			var datatable   = dc.dataTable("#dc-data-table");
      			datatable
      			    .dimension(dateDimReal)
      			    .group(function(d) {return d[4];})
      			    // dynamic columns creation using an array of closures
      			    .columns([
      			        function(d) { return d[0].getDate() + "/" + (d[0].getMonth() + 1) + "/" + d[0].getFullYear(); },
      			        function(d) {return d[1];},
      			        function(d) {return d[2];},
      			        function(d) {return d[3];}
      			    ])
      });
})

app.directive('myDashboard', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/dashboard.html'
  };
});
