function CoveoRelatedResults(searchInterface, containerSelector, templateSelector, fieldA, fieldB, relatedQuery){
  if (!(this instanceof CoveoRelatedResults) ) return new CoveoRelatedResults(searchInterface, containerSelector, templateSelector, fieldA, fieldB, relatedQuery);
  var groupByIndex = -1;
  var lastGroupByResult = [];

  $(searchInterface).on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e, args) {
    // We store the groupBy index because it will come back in the same order
    groupByIndex = args.queryBuilder.groupByRequests.length;
    args.queryBuilder.groupByRequests.push({
      field: fieldA,
      sortCriteria: "ChiSquare",
      maximumNumberOfValues: 4,
      injectionDepth: 1000
    })
  });
  
  $(searchInterface).on(Coveo.Events.QueryEvents.querySuccess, function(e, args) {
    if(groupByIndex != -1){
      if(args.results.groupByResults.length == 0){
        $(containerSelector).empty();
      } else {
        var groupByResults = args.results.groupByResults[groupByIndex].values;
        groupByIndex = -1;
        if(_.some(groupByResults, function(result, i){ return lastGroupByResult.indexOf(result.value+':'+result.numberOfResults) != i; })){
          lastGroupByResult = _.map(groupByResults, function(result){ return result.value+':'+result.numberOfResults; });

          var queryBuilder = new Coveo.Ui.QueryBuilder();
          queryBuilder.advancedExpression.addFieldExpression(fieldB, '==', _.map(groupByResults, function(result){return result.value}));
          queryBuilder.constantExpression.add(relatedQuery);

          Coveo.Rest.SearchEndpoint.endpoints["default"].search(queryBuilder.build()).done(function(data) {
            var resultsMap = {}

            _.forEach(data.results,function(result){
              resultsMap[result.raw[fieldB.substr(1)]] = result;
            });

            var container = $(containerSelector).empty();
            var template = _.template($(templateSelector).text())

            _.forEach(groupByResults,function(result){
              console.log(result);
              container.append(template({
                groubBy:result,
                result:resultsMap[result.value]
              }));
            });
          });
        }
      }
    }
  });
}
