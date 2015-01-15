$("#search").on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e, args) {
  var query = args.queryBuilder.build()

  var expressions = [];
  _.forEach([query.q,query.aq, "@URI"],function(exp){if(exp){expressions.push("("+exp+")")}});

  var query = {
    q: expressions.join(" AND "),
    numberOfResults: 0,
    groupBy : [{
      field: "@expert",
      sortCriteria: "ChiSquare",
      maximumNumberOfValues: 4,
      injectionDepth: 1000,
      queryOverride: expressions.join(" AND ")
    }]
  }

  Coveo.Rest.SearchEndpoint.endpoints["default"].search(query).done(function(data) {
    var results = data.groupByResults[0].values

    var relatedItems = _.map(results,function(result){
      return "\""+result.value+ "\""
    })

    var query = {
      q:"@useremail=("+relatedItems.join(",")+")"
    };

    var groupByResults = results;

    Coveo.Rest.SearchEndpoint.endpoints["default"].search(query).done(function(data) {
      _.forEach()
      var keyedResults = {}
      _.forEach(data.results,function(result){
        keyedResults[result.raw["useremail"]]=result
      })

      _.forEach(groupByResults,function(result){
        result["fullResult"] = keyedResults[result.value];
      })

      // Template and add things plz
      var container = $("#ExpertsContainer").empty();
      var template = _.template($('#experts-template').text())

      _.forEach(groupByResults,function(result){
        console.log(result)
        container.append(template(result))
      });

    });
  });
});
