var currentLatitude;
var currentLongitude;
var map;
var markerCluster;
	var latfield;
	var lonfield;

var bounds = new google.maps.LatLngBounds();
var ResultMarkers = [];
var mapQueryResults; //because we need the first 100
var mapQuery;
var mapQueryCircle;
var updatebounds;
var initmap;
var allreset;
var initbounds=new google.maps.LatLngBounds();
$(document).ready(function () {
     initmap=true;
	showMap();
});

function addResultMarker(latitude, longitude, name, icon, text,selected) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        name: name,
		icon: 'http://labs.google.com/ridefinder/images/mm_20_red.png',
        selected: selected
    });

    var infobox = new InfoBox({
        content: '<h3 style="font-family: Arial; font-size: 13px; color: #FFFFFF; background-color: #0099FF; text-align: center; font-style: italic">' + marker.name+"</h3>"+text, 
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-112, 0),
        zIndex: -1,
        closeBoxURL: ""
    });

    google.maps.event.addListener(marker, 'click', function () {
        this.selected = !this.selected;
		var circle = new google.maps.Circle({
		map: map,
		radius: 1000,    // 10 miles in metres
		fillColor: '#AA0000'
		});
		circle.bindTo('center', marker, 'position');
		map.fitBounds(circle.getBounds());
		//mapQueryCircle="$qf(function:'(((@mylat-"+marker.getPosition().lat()+")^2)+((@mylon-"+marker.getPosition().lng()+")^2))<((10000/6378137)^2)',fieldName:distance) @distance=1";
		mapQueryCircle="$qf(function:'dist(@mylat, @mylon, "+marker.getPosition().lat()+", "+marker.getPosition().lng()+")<1000',fieldName:'distance') @distance=1";
		$('#search').coveo('executeQuery');
    });

    google.maps.event.addListener(marker, 'mouseover', function () {
        infobox.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
        infobox.close();
    });
    ResultMarkers.push(marker);
}

function clearResultMarkers() {
    for (var i = 0; i < ResultMarkers.length; i++) {
        ResultMarkers[i].setMap(null);
    }
    ResultMarkers = new Array();
}

			
function createResultsMap(query, mylat, mylon)
{
    if (initmap) updatebounds=true;
	google.maps.event.clearListeners(map, 'idle');
	bounds = new google.maps.LatLngBounds();
    initmap=false;
	latfield=mylat;
	lonfield=mylon;
	Coveo.Rest.SearchEndpoint.endpoints.default.search({
                    q: query,
                    enableDuplicateFiltering: true,
                    numberOfResults: 1000
                }).done(function (result) {
                    createMarkers(result.results);
					if (updatebounds)
					{
						map.fitBounds (bounds);
					}
					setTimeout(
							  function() 
							  {							 
									 google.maps.event.addListener(map, 'idle', function(ev){
								    	setTimeout(function() 
										  {
												 mapEvent();
										  }, 1000);
									});
							  }, 1000);
					});
}


function createMarkers(Results) {
    
    clearResultMarkers();
	//bounds = new google.maps.LatLngBounds();
    for (i = 0; i < Results.length; i++) {
        var selected = false;
		//alert(Results[i].raw["mylat2"]);
		if (!isNaN(Results[i].raw[latfield]) && !isNaN(Results[i].raw[lonfield]))
		{
			var position = new google.maps.LatLng(Results[i].raw[latfield], Results[i].raw[lonfield]);
			bounds.extend(position);
			var mytext="";
			//mytext=Coveo.ImageUtils.buildImageFromResult(Results[i], Coveo.Rest.SearchEndpoint.endpoints['default']);
			addResultMarker(Results[i].raw[latfield], Results[i].raw[lonfield], Results[i].Title, "",mytext, selected);
		}
    }
	if (!Coveo.Utils.isNullOrUndefined(markerCluster))
	{
		markerCluster.clearMarkers();
    	markerCluster = new MarkerClusterer(map, ResultMarkers);
	}
	else
	{
    	markerCluster = new MarkerClusterer(map, ResultMarkers);
	}
	//map.fitBounds (bounds);
	if (updatebounds)
	{
	     map.fitBounds (bounds);
	//google.maps.event.trigger(map, 'resize');
	}
	
	
}
function mapEvent()
{
		 var bounds2 = map.getBounds();
		 if (!isNaN(bounds2.getNorthEast().lat()))
		 {
			var ne = bounds2.getNorthEast(); // LatLng of the north-east corner
			var sw = bounds2.getSouthWest(); // LatLng of the south-west corder
			var nw = new google.maps.LatLng(ne.lat(), sw.lng());
			var se = new google.maps.LatLng(sw.lat(), ne.lng());
		 var query='@'+latfield+'<='+ne.lat()+' AND @'+latfield+'>='+sw.lat()+' AND @'+lonfield+'>='+sw.lng()+' AND @'+lonfield+'<='+ne.lng();
		 mapQuery=query;
		 updatebounds=false;
		$('#search').coveo('executeQuery');	 
		}
}

function resetMap() {
	google.maps.event.clearListeners(map, 'idle');
	map=null;
	initmap=true;
	showMap();
}

function createMap() {
    updatebounds=true;
    bounds = new google.maps.LatLngBounds();
	currentLatitude=40.784441;
	currentLongitude=-76.695557;
    initialPosition = new google.maps.LatLng(currentLatitude, currentLongitude);
    var mapOptions = {
        center: initialPosition
    };
    map = new google.maps.Map(document.getElementById("map-canvas"));//, mapOptions);
}


function showMap() {
    allreset=true;
    createMap();
	google.maps.event.trigger(map, 'resize');
    map.fitBounds(bounds);
    map.setZoom(3);
	initbounds=bounds;
    map.setCenter(new google.maps.LatLng(currentLatitude, currentLongitude));
//	$("#map-canvas").hide();
}


   
