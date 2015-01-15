// <script type="text/javascript" src="metrics-graphics/metricsgraphics.js"></script>
// <div id="chart"></div>
var parseDate = function(date) {
  var d = _.map(date.split('..'), function(date) {
    return Date.parse(date, 'yyyy/mm/dd@hh:mm:ss')
  });
  return new Date(d[1] - (d[1] - d[0]) / 2)
}


var defaults = {
  searchEndpoint: "https://nov.demo.coveo.com/rest/search/",
  queryTemplate: {
    "numberOfResults": 0,
    "timezone": "America New_York",
    "groupBy": []
  },
  groupByElement: {
    "field": "@sysdate",
    "maximumNumberOfValues": 40,
    "sortCriteria": "nosort",
    "injectionDepth": 1000,
    "queryOverride": "",
    "generateAutomaticRanges": true
  }
}

var queryParams = _.clone(defaults.queryTemplate);


$(function() {
  $("#popularquerier").on("dataloaded", function(e, themes,query) {
    graphPlease(themes,query.queryBuilder.build());
  });
});

var graphPlease = function(themes,query) {
    //var themes = [{},{}];
    var themes = [{
      value:"Total",
      query:"@URI"
    }];

    var themeLabels = _.map(themes,function(theme){
      return theme.value;
    })

    var e = _.map(themes, function(theme) {
      var e = _.clone(defaults.groupByElement);
      if(theme.query){
        e.queryOverride = theme.query;
      }else{
        e.queryOverride = ""+theme.field+"==\"" + theme.value + "\"";
      }
      if(query.aq){
        e.queryOverride += " AND (" + query.aq +")";
      }
      return e;
    });
console.log(e)
    queryParams.groupBy = e;
    //queryParams.aq=query.aq;

    Coveo.Rest.SearchEndpoint.endpoints["default"].search(queryParams).done(function(data){
console.log(data)
      var values = data.groupByResults;
      var processedData = _.map(values, function(resultGroup) {
        return _.map(resultGroup.values, function(result) {
          return {
            numberOfResults: result.numberOfResults,
            date: parseDate(result.value),
            nonParsedDate: result.value
          }
        });
      });
      console.log(processedData)

      MG.data_graphic({
        data: processedData,
        legend: themeLabels,
        legend_target: '.legend',
        width: 600,
        height: 250,
        target: '#chart',
        x_accessor: 'date',
        y_accessor: 'numberOfResults',
      });
    });
  }
  /*************************************
  var CoveoGraph = function(element) {
    if (!(this instanceof CoveoGraph)) {
      return new CoveoGraph(element);
    }

    var _this = this;
    this.element = element;
    this.root = element.getAttribute('data-coveo-search') || document.getElementsByClassName('CoveoSearchInterface');
    this.terms = [];
  }
  *************************************/
