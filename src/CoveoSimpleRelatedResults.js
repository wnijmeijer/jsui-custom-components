// # CoveoSimpleRelatedResult
//
// CoveoSimpleRelatedResults makes a query similar to a CoveoFacet but can be provided additionnal query parameters or completly new ones.
// This components makes a completly new query using groupBy component of the coveo searchApi, it doesnt use the current query so
// if you want less httprequests and more performance some tweaking will be needed.
// This Component acts almost like a facet, in some case a CoveoFacet may be a better use

// ## Usage Example:
// ```html
// <div class="CoveoSimpleRelatedResults"
// data-expression="@syssource==Descriptions OR @syssource==Comments  OR @syssource==Resolutions"
// data-template="#template"
// data-coveo-root="#search"
// data-sort-by="ChiSquare"
// data-group-by="@txtannovtheme"
// data-number-of-results="8"
// ></div>
// ```

// ## Example Template:
// ```html
// <script id="related-themes-template" type="text/x-underscore-template">
//   <a class="related-result__result related-result__result--tag"
//      href='#q=@txtantheme%3D%3D"<%=value %>"'>
//        <%= value %>
//        <span class="related-result__value"><%= numberOfResults %></span>
//   </a>
// </script>
// ```

// ## Manual Creation
// You can also manually create a CoveoSimpleRelatedResults component
// ```js
//  var component = new CoveoSimpleRelatedResults(e,{
//    root:"#search",
//    resultTemplate:"#template",
//    hiddenExpression:"@syssource==Descriptions",
//    sortBy:"ChiSquare",
//    groupBy:"@txtannovtheme",
//    numberOfResults:8
// });
// ```

var CoveoSimpleRelatedResults = function(element, options) {
  if (!(this instanceof CoveoSimpleRelatedResults)){
    return new CoveoSimpleRelatedResults(element, options);
  }

  this.element = element;
  this.root = options.root
            || element.getAttribute('data-coveo-search')
            || document.getElementsByClassName('CoveoSearchInterface');
  this.options = options;
  this.resultTemplate = _.template($(this.options.resultTemplate).text());
  this.content = $('<div></div>').appendTo($(this.element));
  this.bindEvents();
}
CoveoSimpleRelatedResults.prototype.bindEvents = function() {
  var _this = this;

  $(this.root).on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e, args) {
    var expression = args.queryBuilder.expression.build();
    _this.fetchNewResults(expression, args);
  });
}
CoveoSimpleRelatedResults.prototype.fetchNewResults = function(expression, args) {
  var _this = this;

  var expressions = [];

  _.each([args.queryBuilder.advancedExpression.build(),
    args.queryBuilder.expression.build(),
    _this.options.hiddenExpression
  ], function(exp) {
    if (exp && !Coveo._.isEmpty(exp)) {
      expressions.push("(" + exp + ")")
    }
  })


  var query = {
    q: expressions.join(" AND "),
    numberOfResults: _this.options.numberOfResults
  }


  if (_this.options.groupBy) {
    query.numberOfResults = 0;
    //query.q="";
    query["groupBy"] = [{
      "field": _this.options.groupBy,
      "sortCriteria": _this.options.sortBy ||  "occurences",
      "queryOverride": expressions.join(" AND "),
      "injectionDepth": 1000,
      "maximumNumberOfValues": _this.options.numberOfResults || "5"
    }];
  }


  Coveo.Rest.SearchEndpoint.endpoints["default"].search(query).done(function(data) {
    _this.content.empty();
    if (data.groupByResults && !Coveo._.isEmpty(data.groupByResults)) {
      _.each(data.groupByResults[0].values.slice(0, _this.options.numberOfResults), function(value, index) {
        _this.content.append(_this.resultTemplate(value));
      });
    } else {
      _.each(data.results, function(result, index) {
        _this.content.append(_this.resultTemplate(result));
      });
    };
  });
}

$(function() {
  var relatedResults = document.getElementsByClassName('CoveoSimpleRelatedResults');
  _.each(relatedResults, function(e) {
    var options = {
      root: e.getAttribute('data-coveo-root'),
      resultTemplate: e.getAttribute('data-template'),
      hiddenExpression: e.getAttribute('data-expression'),
      sortBy: e.getAttribute('data-sort-by'),
      groupBy: e.getAttribute('data-group-by'),
      numberOfResults: e.getAttribute('data-number-of-results')
    }
    new CoveoSimpleRelatedResults(e, options);
  });
});
