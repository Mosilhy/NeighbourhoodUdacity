var map;
var myMarkers = [];
var filtered = ko.observableArray();
var mylocationsfilter = ko.observableArray();
this.searchlocations = ko.observable("");
var mylocations = ko.observableArray([{
    id: 1,
    title: 'Faculty of Commerce Ain shams',
    location: { lat: 30.074582, lng: 31.287575 },
},
{
    title: 'Computer science Ain shams',
    location: { lat: 30.078237, lng: 31.284954 },

},
{
    title: 'Faculty Of Science - Ain Shams',
    location: { lat: 30.0777343, lng: 31.2817749 },
},
{
    title: 'Faculty Of Law - Ain Shams',
    location: { lat: 30.077277, lng: 31.283414 },
},
{
    title: 'Open Education Center - Ain Shams University',
    location: { lat: 30.0773421, lng: 31.2842302 },
}

]);

function main() {
    ko.applyBindings(new ViewModel());
}


var ViewModel = function () {
    //var self = this;

    this.searchkey = ko.observable("");

    this.bindList = ko.computed(function () {
        var searchbox = this.searchkey().toLowerCase();
        if (!searchbox) {
            mylocationsfilter = ko.observableArray();
            mylocations().forEach(function (LocObj) {
                mylocationsfilter.push(LocObj);

            });
            setmarks();
            return mylocationsfilter();
        } else {
            mylocationsfilter = ko.observableArray();
            mylocations().forEach(function (LocObj) {
                var string = LocObj.title.toLowerCase();
                var result = (string.search(searchbox) >= 0);
                if (result == 1) {
                    mylocationsfilter.push(LocObj);
                }
            });
            setmarks();
            return mylocationsfilter();
        }
    }, this);

   

    console.log("Done!");

    //google.maps.event.addDomListener(window, 'resize', function () { });


};

function setmarks() {
    console.log(mylocationsfilter());
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.075807, lng: 31.281116 },
        zoom: 14,
        mapTypeControl: true
    });
    var largeInfowindow = new google.maps.InfoWindow();

    mylocationsfilter().forEach(function (LocObj) {
        // console.log(locationItem);
        var marker = new google.maps.Marker({
            position: LocObj.location,
            map: map,
            title: LocObj.title,
            lat: LocObj.location.lat,
            lon: LocObj.location.lng

        });
        console.log(marker.title);
       
        function bar(markerz) {
            markerz.setAnimation(google.maps.Animation.BOUNCE);
            populateInfoWindow(markerz, largeInfowindow);
            setTimeout(function () {
                markerz.setAnimation(null);
            }, 2000);
        };
        google.maps.event.addListener(marker, 'click', function () {
            bar(marker);

        });
        this.makeitbounce = function () {
              console.log(marker);
            //google.maps.event.trigger(this, 'click');
            bar(marker);
        };

        
    
    });
    
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        
        console.log(marker.lat);
        console.log(marker.lon);

        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + marker.lat + '&' +'lon='+ marker.lon+'&appid=7b52d38392ee89f48bcf283acb7b4d48').then(response => {
                return response.json();
            }).then(data => {
                console.log("APi fetched sucessfully");
                console.log(data.main.temp);
                console.log(data);

                console.log(data.weather[0].description);
                infowindow.setContent('<div> The Temperature now in ' + marker.title + ' is ' + data.main.temp + ' C  ' + '</div> </br>' + 'Weather State : ' + data.weather[0].description);
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.setMarker = null;
                });

            }).catch(err => {
                // Do something for an error here
                console.log("There is an error happened  with the API");
                infowindow.setContent('<div>'+'Sorry We could not retrive data correctly , Please Check it Later'+'</div>');
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.setMarker = null;
                });
                });
            
        }

        
    }











}

function errorHandling() {
    alert("Check your Network connection , if the problem persists contact us at Mosilhy17@gmail.com ");
}
