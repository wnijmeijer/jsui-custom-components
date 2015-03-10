/* jshint undef:true, eqeqeq:true, curly:true, strict:true, laxbreak: true, laxcomma: true */
/* global Coveo,window */


// http://c3js.org/samples/data_stringx.html

(function($,_,undefined){
  "use strict";
  // Charts Using GroupByQuery
  // Parameters:
  // {
  //   searchInterface:"#search", // The coveo Search Interface selector
  //   chartselector:"",          // The container for storing your results
  //   charttype:"",              // The type of chart
  //   field:"",                  // Group by field, if sysdate a distribution chart will be used
  //   seriesfield:"",            // Series field in the case of a distribution chart
  //   computedfields:"",         // Computed fields to use
  //   queries:"",                // Queries to execute
  //   legendtext:"",             // Legend text
  //   includecount:true/false,	  // Do you want to show counts in the chart (requires normally a chart with two y axis
  //   colors:"",                 // Colors to use for the chart
  //   sortCriteria:"",           // The sorting to use
  //   numberOfResults:5,         // The number of Related results you want
  //   debug : false              // If you want some debug output
  //  }
  function CoveoCharts(options){
    if(!(this instanceof CoveoCharts)){
      return new CoveoCharts();
    }

	//Parse date when using distribution graph
	 var parseDate = function(date) {
		var d = _.map(date.split('..'), function(date) {
		  return Date.parse(date, 'yyyy/mm/dd@hh:mm:ss');
		});
		return new Date(d[1] - (d[1] - d[0]) / 2);
	};
	 var parseDateNr = function(date) {
		var d = _.map(date.split('..'), function(date) {
		  return Date.parse(date, 'yyyy/mm/dd@hh:mm:ss');
		});
		return new Date(d[0]).getTime()/1000/60;
	};
	//Parse date when using distribution graph
	 var getDate = function(date) {
		var d = _.map(date.split('..'), function(date) {
		  return Date.parse(date, 'yyyy/mm/dd@hh:mm:ss');
		});
		return d;
	};
	
    var opts = _.defaults(options, {
      searchInterface: "#search",
      numberOfResults: 5,
	  sortCriteria: "ChiSquare",
      debug : false
    });
	var chart;
    var selectedValue="";
    var groupByIndex=-1;
    var lastGroupByResults = [];
	var toProcess=80;
	var DatesToGet=50;
	var currentProcess=0;
    // Get the related elements in the current Query by appending
    // to groupBy and getting new results (like facets)
    $(opts.searchInterface).on(Coveo.Events.QueryEvents.doneBuildingQuery, function(e,args){
		  groupByIndex = args.queryBuilder.groupByRequests.length;
		  //When field is sysdate do something different
		  if (opts.field=='@sysdate')
		  {
		      if (opts.computedfields.length==0 || (opts.seriesfield!='' && opts.computedfields.length>0))
			  {
				  //if series field is NOT empty, use that as a group by
				  if (opts.seriesfield!='')
				  {
					  args.queryBuilder.groupByRequests.push({
						field: opts.seriesfield
					  , sortCriteria : opts.sortCriteria
					  , maximumNumberOfValues : opts.numberOfResults
					  , injectionDepth: 1000
					  , computedFields: opts.computedfields
					  });
				  }
				  else
				  {
					  args.queryBuilder.groupByRequests.push({
						field: opts.field
					  , maximumNumberOfValues: DatesToGet
					  , sortCriteria : "nosort"
					  , injectionDepth: 1000
					  , queryOverride : ""
					  , generateAutomaticRanges: true
					  });
				  }
			  }
			  else
			  {
				  args.queryBuilder.groupByRequests.push({
					field: opts.field
				  , maximumNumberOfValues: DatesToGet
				  , sortCriteria : "nosort"
				  , injectionDepth: 1000
				  , queryOverride : ""
				  , generateAutomaticRanges: true
				  , computedFields: opts.computedfields
				  });
			  }
			  currentProcess=0;
			  
		  }
		  else
		  {
			//When no SYSDATE
			  args.queryBuilder.groupByRequests.push({
				field: opts.field
			  , sortCriteria : opts.sortCriteria
			  , maximumNumberOfValues : opts.numberOfResults
			  , injectionDepth: 1000
			  , computedFields: opts.computedfields
			  });
		  }
		  if (!chart)
		  {
			  //Create the charts
			  if (opts.charttype=='multibar')
			  {
					 nv.addGraph(function() {
					  chart = nv.models.multiBarChart()
							.margin({top: 50, right: 60, bottom: 30, left: 100})
						    .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
							.x(function(d) { return d.mynr })   //We can modify the data accessor functions...
							.y(function(d) { return d.y })   //...in case your data is formatted differently.
							.rotateLabels(0)      //Angle to rotate x-axis labels.
							.showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
							.groupSpacing(0.1)    //Distance between each group of bars.
					;
					return chart;
					});
			  }
			  if (opts.charttype=='linebar')
				  {
					 nv.addGraph(function() {
					 chart = nv.models.linePlusBarChart()
							.margin({top: 50, right: 60, bottom: 30, left: 100})
							.focusEnable(focus)
							.focusHeight(50)
							.options({title:opts.charttitle})
							.x(function(d) { return d.x })
							.y(function(d) { return d.y })   //...in case your data is formatted differently.
  						    .legendRightAxisHint(' [Using Right Axis]')
						;
						
						chart.y1Axis.tickFormat(function(d) { return '' + d3.format(',f')(d) });
						chart.xAxis.showMaxMin(false);
						chart.y1Axis.showMaxMin(false);
						chart.y2Axis.showMaxMin(false);
						chart.x2Axis.showMaxMin(false);
						return chart;
					});
				 }
				  if (opts.charttype=='pie')
				  {
					  nv.addGraph(function() {
						  chart = nv.models.pieChart()
							  .x(function(d) { return d.key })
							  .y(function(d) { return d.values })
							  .options({title:opts.charttitle})
							  .growOnHover(true)
							  .showLabels(true);
							  return chart;
					  });
					}
				 if (opts.charttype=='stackedarea')
				 {
				 
						 nv.addGraph(function() {
							chart = nv.models.stackedAreaChart()
							.margin({top: 50, right: 60, bottom: 100, left: 100})
							  .x(function(d) { return d.mynr })   //We can modify the data accessor functions...
							  .y(function(d) { return d.y })   //...in case your data is formatted differently.
							  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
							  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
							  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
							  .options({title:opts.charttitle})
							  .clipEdge(true);
							  chart.xAxis.showMaxMin(false);
							  chart.yAxis.showMaxMin(false);
						  return chart;
					   });
				 }
				 if (opts.charttype=='linefocus')
				 {
				 
						 nv.addGraph(function() {
							chart = nv.models.lineWithFocusChart()
								.margin({top: 50, right: 60, bottom: 30, left: 100})
								.focusHeight(50)
								//.focusEnable(focus)
								.x(function(d) { return d.x })   //We can modify the data accessor functions...
								.y(function(d) { return d.y })   //...in case your data is formatted differently.
								.options({title:opts.charttitle});
								chart.xAxis.showMaxMin(false);
								chart.yAxis.showMaxMin(false);
								chart.y2Axis.showMaxMin(false);
								chart.x2Axis.showMaxMin(false);
						  return chart;
					   });
				 }
				 if (opts.charttype=='linechart')
				 {
				 
						 nv.addGraph(function() {
							chart = nv.models.lineChart()
								.margin({top: 50, right: 60, bottom: 100, left: 100})
								.useInteractiveGuideline(true)
								.isArea(false)
								//.focusEnable(focus)
								.x(function(d) { return d.x })   //We can modify the data accessor functions...
								.y(function(d) { return d.y })   //...in case your data is formatted differently.
								.options({title:opts.charttitle});
								chart.xAxis.showMaxMin(false);
								chart.yAxis.showMaxMin(false);
						  return chart;
					   });
				 }
		  }
    });

    //Make sure to show a message when we used the chart as a filter
	 $(opts.searchInterface).on('populateBreadcrumb', function(e, args){
                if (selectedValue!="")
				{
                    var container = "<div>Filtered on "+selectedValue+".</div>";
                    args.breadcrumbs.push({ element: container });
                }
		});
		
    //Make sure to clear the chart when breadcrumb is cleared
	$(opts.searchInterface).on('clearBreadcrumb', function(e, args){
			selectedValue="";
			$(opts.searchInterface).coveo('executeQuery');
	});
		
    //When the map is used as a filter, add it to the query
	$(opts.searchInterface).on("buildingQuery", function (e, args) {
				if (selectedValue!="")
				{
					   args.queryBuilder.advancedExpression.add(opts.field+'=="'+selectedValue+'"');
				}
		});	

    function checkAll(all,myx,defval)
	{
	   var newall=[];
	   var curKey="";
	   var found=false;
	   var lastone=[];
	   var prev=[];
	   try
	   {
	   curKey=all[0].key;
	   }
	   catch(e){}
		_.forEach( all, function ( allval ){
	       lastone=allval.values;
		   if (allval.key==curKey)
		   {
		       _.forEach( allval.values, function ( vals ){
			      if (vals.x==myx)
				  {
				     found=true;
				  }
			   });
		   }
		   else
		   {
		       if (curKey=="")
			   {
			       //This is the first so start processing
			   }
			   else
			   {
			       //If not found add it to the array
			       if (!found)
				   {
  					   var first=prev;
 					   first.push({x:myx,y:defval,mynr:myx});
				       newall.push({key:curKey,values:first});
				   }
				   else
				   {
				       newall.push({key:curKey,values:prev});
				   }
			   }
			   curKey=allval.key;
			   found=false;
		   }
		   prev=allval.values;
	   });	 
	   //Parse the last one
	   			       if (!found)
				   {
  					   var first=lastone;
 					   first.push({x:myx,y:defval,mynr:myx});
				       newall.push({key:curKey,values:first});
				   }
				   else
				   {
				       newall.push({key:curKey,values:lastone});
				   }

       return newall;	   
	}

	function getIndex(values, mykey)
	  {
	      var cur=0;
		  var key=0;
			_.forEach( values, function ( allval ){
			   if (allval.mynr == mykey)
			   {
				   key=cur;
			   }
			   cur=cur+1;
		   });	 
		  return key;
	 }
	 //Get the series
	  function getSeries(values, fullquery, donecall) {
	          var nr=1;
			  var all = [];
   		      var mycounts=[];
			  var mycolors=[];
			  
			  //Check if we have queries defined
			  var querycheck=false;
			  if (opts.queries!=undefined)
			  {
			      if (opts.queries.length!=0)
				  {
				      querycheck=true;
				  }
			  }
			  
			  if (opts.colors!=undefined)
			  {
				mycolors=opts.colors.split(";");
			  }
			  var firstcolor='green';
			  if (mycolors.length>0)
			  {
			     firstcolor=mycolors[0];
			  }
			  if (opts.field=='@sysdate' && opts.includecount==true && !querycheck)
			  {
				  _.forEach(values, function(groupByValue){
					   mycounts.push({x:parseDate(groupByValue.value),y:groupByValue.numberOfResults,mynr:nr});
					   nr=nr+1;
				  });
				  all.push({key:opts.legendtext.split(";")[0],values:mycounts,color:firstcolor});
			  }
			  else if (opts.field!='@sysdate')
			  {
			      if (opts.includecount==true)
				  {
					  _.forEach(values, function(groupByValue){
					       //ONly for pie different story
						   if (opts.charttype=='pie')
						   {
							   all.push({key:groupByValue.value,values:groupByValue.numberOfResults,mynr:nr});
						   }
						   else
						   {
							   mycounts.push({x:groupByValue.value,y:groupByValue.numberOfResults,mynr:nr});
							   nr=nr+1;
						   }
					  });
					  if (opts.charttype!='pie')
					  {
						all.push({key:opts.legendtext.split(";")[0],values:mycounts,color:firstcolor});
					  }
				  }
			  }
			  var a = opts.legendtext.split(";"),i;
              
			  //Using sysdate is the most complicated one.
			  if (opts.field=='@sysdate' && ((opts.computedfields.length!=0) || (querycheck)))
			  {
			      //If no series, then the groupby on date already contains the computed/count values, no need to do a lot of processing
			      if (opts.seriesfield=="" && !querycheck)
				  {
				      var from=0;
				      if (opts.includecount==true)
					  {
					      from=1;
					  }
					  else
					  {
					      from=0;
					  }
					  for (i = from; i < a.length; i++) {
						  nr=from;
						  var mycomputed=[];
						  _.forEach(values, function(groupByValue){
							   //myvals.push({x:nr,y:groupByValue.numberOfResults});
							   if (isNaN(groupByValue.computedFieldResults[i-from]))
							   {
									mycomputed.push({x:parseDate(groupByValue.value),y:0,mynr:nr});
							   }
							   else
							   {
									mycomputed.push({x:parseDate(groupByValue.value),y:groupByValue.computedFieldResults[i-from],mynr:nr});
							   }
							   nr=nr+1;
						  });
						  if (opts.includecount==true)
						  {
						    if (mycolors.length>0)
							{
								all.push({key:a[i],values:mycomputed,bar:'true',color:mycolors[i]});
							}
							else
							{
								all.push({key:a[i],values:mycomputed,bar:'true'});
							}
						  }
						  else
						  {
							if (mycolors.length>0)
							{
								all.push({key:a[i],values:mycomputed,color:mycolors[i]});
							}
							else
							{
								all.push({key:a[i],values:mycomputed});
							}
						  }
					  }
					  if (donecall) donecall(all);
				  }
				  else
				  {
				      // We need to parse the series
					  // The first group by already had the Groupby on the series field
					  // Now we will create for each series value a new @sysdate query so that we get all individual counts/computed fields
					  
					  // If queries are defined we need to use the queries instead of the series
					  // In the case of queries the values are already the dates
					  var series=[];
					  var myqueries=[];
					  var groupbyvaluesDates=[];
					  if (querycheck)
					  {
					      //First build up the ranges for the query
						  /*_.forEach(values, function(groupByValueSeries){
						       var d=groupByValueSeries.value.split('..')
								groupbyvaluesDates.push({start:d[0], end:d[1], endInclusive:false});
						  });*/
					      values=opts.legendtext.split(";");
						  myqueries=opts.queries.split(";");
					  }
					  else
					  {
						  if (values.length==0)
						  {
							//When we have nothing, do nothing
							if (donecall) donecall(all);
						  }
					  }
					  currentProcess=0;
					  toProcess=values.length;
							 var mycomputed=[];
							 var myquerynr=0;
						  //If it is sysdate then we need to execute a new query for every sysdate to get the fields and/or the computed fields
						  _.forEach(values, function(groupByValueSeries){
							  //Query the data 
							  var queryBuilder2 = new Coveo.Ui.QueryBuilder();
							  queryBuilder2.advancedExpression.add(fullquery.computeCompleteExpression());
							  queryBuilder2.numberOfResults = 0;
							  nr=1;
							  //Add the current series value
							  if (querycheck)
							  {
								queryBuilder2.advancedExpression.add(myqueries[myquerynr]);
							  }
							  else
							  {
								queryBuilder2.advancedExpression.add(opts.seriesfield+'=="'+groupByValueSeries.value+'"');
							  }
							  queryBuilder2.groupByRequests.push({
										field: opts.field
									  , maximumNumberOfValues: DatesToGet
									  , sortCriteria : "nosort"
									  , injectionDepth: 1000
									  , queryOverride : ""
									  , generateAutomaticRanges: true
									  , computedFields: opts.computedfields
									  });
							  var deferred = Coveo.Rest.SearchEndpoint.endpoints["default"].search(queryBuilder2.build());
							  myquerynr=myquerynr+1;
							  deferred.always(function(data) {
							     
								 if (data.groupByResults.length>0)
								 {
								  nr=1;
								  _.forEach(data.groupByResults[0].values, function(groupByValue){
									   //myvals.push({x:nr,y:groupByValue.numberOfResults});
									   //First check if we can find the existing key
									   var key=-1;
									   var cur=0;
									   _.forEach( all, function ( allval ){
									       if (querycheck)
										   {
											   if (allval.key == groupByValueSeries)
											   {
												   key=cur;
											   }
										   }
										   else
										   {
											   if (allval.key == groupByValueSeries.value)
											   {
												   key=cur;
											   }
										   }
										   cur=cur+1;
									   });
									   if (key==-1)
									   {
											var myval=[];
											if (opts.includecount==true)
											{
												myval.push({x:parseDate(groupByValue.value),y:groupByValue.numberOfResults,mynr:parseDateNr(groupByValue.value)});//nr});
												if (querycheck)
												{
													all.push({key:groupByValueSeries,values:myval});
												}
												else
												{
													all.push({key:groupByValueSeries.value,values:myval});
												}
											}
											else
											{
												if (isNaN(groupByValue.computedFieldResults[0]))
												{
													myval.push({x:parseDate(groupByValue.value),y:0});
												}
												else
												{
													myval.push({x:parseDate(groupByValue.value),y:groupByValue.computedFieldResults[0],mynr:parseDateNr(groupByValue.value)});
												}
												if (querycheck)
												{
													all.push({key:groupByValueSeries,values:myval});
												}
												else
												{
													all.push({key:groupByValueSeries.value,values:myval});
												}
											}
												all=checkAll(all,parseDate(groupByValue.value),0);
									   }
									   else
									   {
											var first=all[key].values;
											if (opts.includecount==true)
											{
												first.push({x:parseDate(groupByValue.value),y:groupByValue.numberOfResults,mynr:parseDateNr(groupByValue.value)});
												all[key].values=first;
											}
											else
											{
												if (isNaN(groupByValue.computedFieldResults[0]))
												{
													first.push({x:parseDate(groupByValue.value),y:0});
												}
												else
												{
													first.push({x:parseDate(groupByValue.value),y:groupByValue.computedFieldResults[0],mynr:parseDateNr(groupByValue.value)});
												}
												all[key].values=first;
											}
												all=checkAll(all,parseDate(groupByValue.value),0);
									   }
									   nr=nr+1;
	   								  

								  });
								 }
								currentProcess=currentProcess+1;
									  if (currentProcess==toProcess)
									  {
										   //We now have it all
										   // all = key1, values multiple times
										   donecall(all);
										   return true;
									  }							
							  });//.always(function(){
								  //all.push({key:series,values:mycomputed,bar:'true'});});
								/*  currentProcess=currentProcess+1;
								  if (currentProcess==toProcess)
								  {
									   //We now have it all
									   // all = key1, values multiple times
									   donecall(all);
								  }
							});*/
					  });
						  //}).done(function(){
						  //donecall(all);});
					}  
				  
			  }
			  else
			  {
			      //Not Sysdate so add the computed/count values to the series
				      var from=0;
				      if (opts.includecount==true)
					  {
					      from=1;
					  }
					  else
					  {
					      from=0;
					  }
			  
				  for (i = from; i < a.length; i++) {
					  nr=from;
					  var mycomputed=[];
					  _.forEach(values, function(groupByValue){
						   //myvals.push({x:nr,y:groupByValue.numberOfResults});
	   					  if (opts.charttype!='pie')
						  {

						    if (isNaN(groupByValue.computedFieldResults[i-from]))
							{
								mycomputed.push({x:groupByValue.value,y:0,mynr:nr});
							}
							else
							{
								mycomputed.push({x:groupByValue.value,y:groupByValue.computedFieldResults[i-from],mynr:nr});
						   }
						   nr=nr+1;
						  }
						  else
						  {
						    //If Pie
						    if (isNaN(groupByValue.computedFieldResults[i-from]))
							{
								all.push({key:groupByValue.value,values:0,mynr:nr});
							}
							else
							{
								all.push({key:groupByValue.value,values:groupByValue.computedFieldResults[i-from],mynr:nr});
						   }
						  }
					  });
   					  if (opts.charttype!='pie')
					  {
						  if (mycolors.length>0)
						  {
							all.push({key:a[i],values:mycomputed,bar:'true',color:mycolors[i]});
						  }
						  else
						  {
							all.push({key:a[i],values:mycomputed,bar:'true'});
						  }
					  }
				  }
				  if (donecall) 
				  { 
				      donecall(all);
					  return true;
				  }
			  }
			  //return all;
	  }
	
	//When our query is ready, start processing
	$(opts.searchInterface).on(Coveo.Events.QueryEvents.querySuccess,function(e,args){

		var container = $(opts.containerSelector);
		var groupBy = args.results.groupByResults[groupByIndex];
		  if (groupBy!=undefined)
		  {
		      //This is for the simple charts without any series
			  var mydata = _.map(groupBy.values, function(groupByValue){
				return {key:groupByValue.value, values:groupByValue.numberOfResults}
			  });
			  //Add the title to the graph
			 var $svg = $(opts.chartselector);
			 if ($svg.find('.chart-title').length!=0)
			 {
			 }
			 else
			 $svg.prepend('<div class="chart-title">'+opts.charttitle+'</div>');
			 var mylinedata=getSeries(groupBy.values,args.queryBuilder, function(mynew){
			      if (mynew.length==0)
				  {
				      $(opts.chartselector).hide();
				  }
				  else
				  {
					  if (mynew[0].values.length==0)
					  {
						  $(opts.chartselector).hide();
					  }
					  else
					  {
						 $(opts.chartselector).show();
					  }
					  //********************************************************
					  //***        Stackedarea or Multibar
					  //********************************************************
					  if (opts.charttype=='stackedarea' || opts.charttype=='multibar' || opts.charttype=='linefocus' || opts.charttype=='linebar' || opts.charttype=='linechart')
					  {
					  
						 chart.xAxis.rotateLabels(-45);
						 chart.xAxis.tickFormat(function(d) {
							//console.log(mylinedata[0].values[d]);
									var dx = "";
									var ind=getIndex(mynew[0].values, d);
									if (mynew[0].values[ind]!=undefined) dx=mynew[0].values[ind].x;
									return dx;
									});
						  //If we have a sysdate make sure to format the date properly on the xaxis
						  if (opts.field=='@sysdate')
						  {
								chart.xAxis
									  .showMaxMin(false)
									  .tickFormat(function(d) {
										var dx = "";
										var i=0;
										return d3.time.format('%d %b %y')(new Date(d));
									  });
							}
							if (opts.charttype=='linefocus' || opts.charttype=='linebar')
							{
								//This is the xaxis for the focus chart
								chart.x2Axis
									  .showMaxMin(false)
									  .tickFormat(function(d) {
										var dx = "";
										return d3.time.format('%d %b %y')(new Date(d));
									  });
							}
							if (opts.charttype=='linebar')
							{
								chart.bars.forceY([1]);
							}
									
						
				  }
				  
				  //Create the chart
				  d3.select(opts.chartselector+" svg")
							.datum(mynew)
							.transition().duration(500)
							.call(chart)
							;
				  //Add events
				  if (opts.field!='@sysdate')
				  {
						if (chart.lines!=undefined)
						{
							chart.lines.dispatch.on("elementClick", function(e) {
							 if (selectedValue!="")
							  {
								selectedValue = "";
								$(opts.searchInterface).coveo('executeQuery');
							  }
							  else
							  {
								selectedValue = e.point.x;
								$(opts.searchInterface).coveo('executeQuery');
							  }
							});
						}
						if (chart.bars!=undefined)
						{
							chart.bars.dispatch.on("elementClick", function(e) {
							  if (selectedValue!="")
							  {
								selectedValue = "";
								$(opts.searchInterface).coveo('executeQuery');
							  }
							  else
							  {
								selectedValue = e.data.x;
								$(opts.searchInterface).coveo('executeQuery');
							   }
							});
						}
						if (chart.pie!=undefined)
						{
							chart.pie.dispatch.on("elementClick", function(e) {
							//console.log(e);
								  if (selectedValue!="")
								  {
									selectedValue = "";
									$(opts.searchInterface).coveo('executeQuery');
								  }
								  else
								  {
									selectedValue = e.point.key;
									$(opts.searchInterface).coveo('executeQuery');
								  }
								
							});
						}
				  }
			  }
           });
		}
      });
  }
  window.CoveoCharts = CoveoCharts;
})(Coveo.$,Coveo._,undefined);