// # CoveoPopularQuerier
//
// A component that queries and doesnt show results, instead it launches and event (`dataloaded`)
// which gives you an array of objects:
// ```json
// [
//   ...,
//   {
//     "field": "@txtannovtheme",
//     "value": "Inspection",
//     "score": 18172
//   },
//   ...
// ]
// ```
// And the query that was run to obtain those objects (in case you want to do other queries based on that)


// ## Usage:
// <span id="popularquerier" class="CoveoPopularQuerier"
// data-hidden-expression="@syssource==Descriptions OR @syssource==Comments"
// data-coveo-search="#search" data-number-of-results="5"
// data-field="@txtannovtheme" ></span>

// $(function() {
//   $("#popularquerier").on("dataloaded", function(e, results,query) {
//     console.log(results,query.queryBuilder.build());
//   });
// });


var CoveoPopularQuerier = function(element, root) {
  var _this = this;
  this.element = element;
  this.popular = [];
  this.root = root || element.getAttribute('data-coveo-search') || document.getElementsByClassName('CoveoSearchInterface');

  this.numberOfResults = element.getAttribute('data-number-of-results') || 5;
  this.field = element.getAttribute('data-field') || 'syscollection';
  this.hiddenExpression = element.getAttribute('data-hidden-expression');

  $(this.root).on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e, args) {

    var queryBuilder = new Coveo.Ui.QueryBuilder();
    var expression = args.queryBuilder.build();

    _this.fetchNewResults(expression, args);
  });
}

CoveoPopularQuerier.prototype.fetchNewResults = function(expression, args) {
  var _this = this;

  var expressions = [];

  _.each([_this.hiddenExpression,expression.q,expression.aq],function(exp){
    if(exp){expressions.push("("+exp+")")}
  })

  var query = {
    q: "",
    numberOfResults: 0,
    groupBy: [{
      field: _this.field,
      sortCriteria: "ChiSquare",
      injectionDepth: 1000,
      queryOverride: expressions.length === 0 ? undefined : expressions.join(" AND "),
      maximumNumberOfValues: this.numberOfResults
    }]
  }

  Coveo.Rest.SearchEndpoint.endpoints["default"].search(query).done(function(data) {
    if (data.groupByResults && !Coveo._.isEmpty(data.groupByResults)) {
      var results = _.map(data.groupByResults[0].values, function(v) {
        return {
          field: _this.field,
          value: v.value,
          score: v.numberOfResults
        }
      });
      this.popular = results;
      $(_this.element).trigger("dataloaded", [results,args]);
    }
  });
}


// Auto-Init popular querier
$(function() {
  var popularQueriers = document.getElementsByClassName('CoveoPopularQuerier');
  _.each(popularQueriers, function(popularQuerier) {
    new CoveoPopularQuerier(popularQuerier);
  });
});
