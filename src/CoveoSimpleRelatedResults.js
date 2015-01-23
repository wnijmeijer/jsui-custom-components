/* jshint undef:true, eqeqeq:true, curly:true, strict:true, laxbreak: true, laxcomma: true */
/* global Coveo, window */
(function(Coveo, $, _, undefined) {
  "use strict";

  // # CoveoSimpleRelatedResult
  //
  // CoveoSimpleRelatedResults makes a query similar to a CoveoFacet but can be provided additionnal query parameters or completly new ones.
  // This components makes a completly new query using groupBy component of the coveo searchApi, it doesnt use the current query so
  // if you want less httprequests and more performance some tweaking will be needed.
  // This Component acts almost like a facet, in some case a CoveoFacet may be a better use

  // Options: {
  //   searchInterface:"#search", // The coveo Search Interface selector
  //   containerselector:"",      // The container for storing your results
  //   templateSelector:"",       // The template for each result shown
  //   queryField:"",             // The field on your local elements which will match remote (related) elements
  //   numberOfResults:5,         // The number of Related results you want
  //   debug : false              // If you want some debug output
  //  }

  var CoveoSimpleRelatedResults = function(opts){
    if(!(this instanceof CoveoSimpleRelatedResults)){
      return new CoveoSimpleRelatedResults();
    }

    var groupByIndex=-1;
    var lastGroupByResults = [];

    var resultTemplate = _.template($(opts.templateSelector).text());
    var contentContainer  = $('<div></div>').appendTo($(opts.containerSelector));

    // Get the related elements in the current Query by appending
    // to groupBy and getting new results (like facets)
    $(opts.searchInterface).on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e,args){
      groupByIndex = args.queryBuilder.groupByRequests.length;
      args.queryBuilder.groupByRequests.push({
        field: opts.queryField
        , sortCriteria : opts.sortCriteria || "ChiSquare"
        , maximumNumberOfValues : opts.NumberOfResults
        , injectionDepth: 1000
      });
    });

    $(opts.searchInterface).on(Coveo.Events.QueryEvents.querySuccess,function(e,args){
      contentContainer.empty();

      if( groupByIndex === -1 || args.results.groupByResults === 0 ){
        return;
      }

      var results = _.map(args.results.groupByResults,function(v){
        return {
          field:opts.queryField.substr(1),
          value:v.value,
          score:v.numberOfResults
        };
      });

      _.forEach(results,function(result){
        contentContainer.append(resultTemplate(result));
      });
    });
  };

})(Coveo, Coveo.$, Coveo._);
