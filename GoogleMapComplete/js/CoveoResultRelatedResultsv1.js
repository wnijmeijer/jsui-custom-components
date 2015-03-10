/* jshint undef:true, eqeqeq:true, curly:true, strict:true, laxbreak: true, laxcomma: true */
/* global Coveo,window */


/*****************************************************************************
 * CoveoResultRelatedResults.js
 *****************************************************************************/
/*****************************************************************************
 *
 * Will create, based on the current hovered result a related result list
 *
 *****************************************************************************/
(function($,_,undefined){
  "use strict";

  // # CoveoResultRelatedResults
  //
  // CoveoResultRelatedResults creates based on the current hovered result a related result list

  // Options: {
  //   searchInterface:"#search", // The coveo Search Interface selector
  //   mainRelatedContainer:"",   // The main container
  //   relatedContainer:"",       // The container for storing your results
  //   templateSelector:"",       // The template for each result shown
  //   query:"",             	  // The Advanced query to execute, fields are noted as [FIELD1][FIELD2] from the fields section
  //   fields:"",             	  // The fields to use from the current result
  //   numberOfResults:5,         // The number of Related results you want
  //   debug : false              // If you want some debug output
  //  }

  var CoveoResultRelatedResults = function(options){
    if(!(this instanceof CoveoResultRelatedResults)){
      return new CoveoResultRelatedResults();
    }
	var opts = _.defaults(options, {
      searchInterface: "#search",
      numberOfResults: 5,
      debug : false
    });
	
	var timerIn;
	var timerOut;
	var relatedContainer=$(opts.mainRelatedContainer);
	var relatedContainerContent=$(opts.relatedContainer);

    var resultTemplate = _.template($(opts.templateSelector).text());
	relatedContainer.hide();
    // Get the related elements in the current Query by appending
    // to groupBy and getting new results (like facets)
    $(opts.searchInterface).on('newResultDisplayed', function(e,args){
	relatedContainer.hide();
      $(args.item).on("mouseenter",function(){
				//$(args.item).css("border-left", "2px solid #f1eded");
				$(this).data('color',$(args.item).css("background-color"));
				$(args.item).css("background-color", "#f1eded");
					//Only do related results after a timeout
					if(timerIn) {
						clearTimeout(timerIn);
						timerIn = null;
					}
					timerIn = setTimeout(function() {
						clearTimeout(timerIn);
						timerIn = null;
						relatedContainer.hide(100);
						relatedContainerContent.empty();
						var queryBuilder = new Coveo.Ui.QueryBuilder();
						  queryBuilder.numberOfResults = opts.numberOfResults;
						  var newquery=opts.query;
						  var a = opts.fields.split(";");
						  var i=0;
						  for (i = 0; i < a.length; i++) {
							newquery=newquery.replace("[FIELD"+(i+1)+"]",args.result.raw[a[i]]);
						  }
						  queryBuilder.advancedExpression.add(newquery);
						  $(args.item).css("border-right", "2px solid #285395");
						  relatedContainer.css("top",$(args.item).offset().top-5);//+ $(window).scrollTop());
						  relatedContainer.css("left",$(args.item).offset().left+$(args.item).width()+15);//+ $(window).scrollTop());
						  Coveo.Rest.SearchEndpoint.endpoints["default"].search(queryBuilder.build()).done(function(data) {
							//$(containerB).fadeOut( 1000 );
							var container = relatedContainerContent.empty();
							//In case of no results
							if (data.results.length==0)
							{
								container.append("No results");
								relatedContainer.show( 100 );
							}
							_.forEach(data.results, function(result) {
							  container.append(resultTemplate({
								result: result
							  }));
							  relatedContainer.show( 100 );
							});
						  });
					 },1000);
			});
			$(args.item).on("mouseleave",function(){
				if(timerOut) {
					clearTimeout(timerOut);
					timerOut = null;
				}
				timerOut = setTimeout(function() {
					clearTimeout(timerOut);
					timerOut = null;
    				//relatedContainer.hide(100);
    			    $(args.item).css("border-right", "none");
				},2000);
				$(args.item).css("background-color", $(this).data('color'));
				//$( this ).animate({ "left": "-=5px" }, "slow" );
				//$( this ).fadeOut( 10 );
				//$( this ).fadeIn( 1000 );
			});
		});
  }
  window.CoveoResultRelatedResults = CoveoResultRelatedResults;
})(Coveo.$, Coveo._);