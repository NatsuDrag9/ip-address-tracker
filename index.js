function documentReady(callback) {
    // if the document is already loaded or rendered
    if (document.readyState != 'loading') {
        callback();
    }
    // else in modern browsers
    else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback);
    }
    // else in IE <= 8 and other equivalent browsers
    else {
        document.attachEvent('onreadystatechange', function(){
            if (document.readyState == 'complete') {
                callback();
            }
        });
    }
}

function ip_map() {
    const map_id = document.getElementById("mapId");
    const search_bar = document.getElementById("searchBar");
    const search_button = document.getElementsByTagName("LABEL")[0];
    // const ip_address = document.getElementById("ipAddress");
    // const location = document.getElementById("location");
    // const time = document.getElementById("time");
    // const isp = document.getElementById("internetServiceProvider");

    const my_map = L.map("mapId").setView([51.505, -0.09], 13);
    const marker_icon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [30, 37],
        iconAnchor: [22, 52],
        popupAnchor: [0, -52],
    });
    const marker = L.marker([51.505, -0.09], {icon: marker_icon}).addTo(my_map);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibmF0c3VkcmFnOSIsImEiOiJja2duZjVlMGYwNjl4Mndtb251aXBiNHJkIn0.YV5B_2Jg0Z0sGXGvyTC1dg'
    }).addTo(my_map);

    search_button.addEventListener("click", function(){
        $(function(){
            $.ajax({
                url: "https://geo.ipify.org/api/v1",
                data: {
                    apiKey: "at_sPtyzOAcbEsx7jUfrogEYKgCLb8Ay",
                    ipAddress: search_bar.value,
                    domain: search_bar.value
                },
                success: function(server_response) {
                    const {ip, location, isp} = server_response;
                    document.getElementById("ipAddress").innerHTML = ip;
                    $("#location").html(`${location.city}, ${location.country} <br /> <span style='line-height: 1.5;'> ${location.postalCode} </span>`);
                    $("#time").html(`UTC ${location.timezone}`);
                    $("#internetServiceProvider").html(`<span style='line-height:1.5;'>${isp}</span>`);

                    my_map.panTo(new L.LatLng(location.lat, location.lng));
                    marker.setLatLng([location.lat, location.lng]);
                }
            });
        });
    });
}

documentReady(ip_map);