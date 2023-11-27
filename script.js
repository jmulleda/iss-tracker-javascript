function getISSData() {
    return fetch('https://api.wheretheiss.at/v1/satellites/25544') // ISS API
        .then(response => response.json())
        .then(data => {
            let issData = { // issData object to be used for data display and Google Maps update
                time: data.timestamp,
                lat: data.latitude,
                lng: data.longitude,
                alt: data.altitude,
                speed: data.velocity
            };
            return issData;
        })
}

function updateISS(time, lat, lng, alt, vel) {
    document.getElementById('timestamp').innerText = new Date(time * 1000).toUTCString(); // Convert to readable date format 
    document.getElementById('latitude').innerText = lat;
    document.getElementById('longitude').innerText = lng;
    document.getElementById('altitude').innerText = alt;
    document.getElementById('speed').innerText = vel;
}

function updateAstronauts() {
    fetch('http://api.open-notify.org/astros.json') // Open notify API
    .then(response => response.json())
    .then(data => {
      let astronauts = data.people;
      let astronautList = document.getElementById('astronaut-list');
      // Loop through the astronauts array and display names
      for (let i = 0; i < astronauts.length; i++) {
        let astronautName = (i + 1) + " " + astronauts[i].name;
        let listItem = document.createElement('li');
        listItem.innerText = astronautName;
        astronautList.appendChild(listItem);
      }
    })
}

function updateMapPosition(coords, marker) {
    let newPosition = new google.maps.LatLng(coords.lat, coords.lng);
    marker.setPosition(newPosition);
}


function initializeMap() {
    let initCoords = { lat: 49.31, lng: -117.65 }; // Default Google maps to Selkirk College, Castlegar campus
    updateISS('Loading...','Loading...','Loading...','Loading...','Loading...');
    let map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 4,
            center: initCoords,
            streetViewControl: false,
            mapTypeId: 'terrain'
        }
    );

    let marker = new google.maps.Marker({
        title: 'ISS',
        position: initCoords,
        map: map,
        clickable: true,
        icon: {
            url: 'images/iss.png',
            scaledSize: new google.maps.Size(90, 45)
        }
    });

    setInterval(() => {
        let promise = getISSData();
        promise.then(issData => {
            let coords = { lat: issData.lat, lng: issData.lng };
            map.setCenter(coords);
            updateISS(issData.time, issData.lat, issData.lng, issData.alt, issData.speed);
            updateMapPosition(coords, marker);
        });
    }, 2000); // Google Maps refreshes every 2 seconds
}

window.onload = initializeMap();
window.onload = updateAstronauts();
