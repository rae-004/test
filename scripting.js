document.addEventListener("DOMContentLoaded", function () {
  var map = L.map('map').setView([24.8607, 67.0011], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
  }).addTo(map);

  let marker = null;
// Function to add or move marker

function setMarker(lat, lng, address = "") {
  // Check if the marker exists, and move it if it does
  if (marker) {
      marker.setLatLng([lat, lng]);
  } else {
      // Create a custom marker using a div and CSS
      const customMarker = L.divIcon({
          className: 'custom-marker', // The custom class defined in CSS
          html: '<span>🏠</span>', // You can replace this with any content (like emoji or text)
          iconSize: [30, 30], // Size of the icon
          iconAnchor: [15, 30], // Anchor position (adjust as needed)
          popupAnchor: [0, -25] // Position of the popup
      });

      // Create the marker at the new position
      marker = L.marker([lat, lng], { icon: customMarker }).addTo(map);
  }

  // Center the map on the new marker
  map.setView([lat, lng], 17);

  // Display the address if provided
  if (address) {
      document.getElementById('address-info').innerHTML = `<strong>Address:</strong> ${address}`;
  }
}


  // Click event to get location details
  map.on('click', async function(e) {
      var latlng = e.latlng;
      setMarker(latlng.lat, latlng.lng);

      // Reverse geocoding API
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
          .then(response => response.json())
          .then(data => {
              if (data && data.display_name) {
                  document.getElementById('address-info').innerHTML = `<strong>Address:</strong> ${data.display_name}`;
              } else {
                  document.getElementById('address-info').innerHTML = '<strong>Address:</strong> Not found';
              }
          })
          .catch(() => {
              document.getElementById('address-info').innerHTML = '<strong>Address:</strong> Error retrieving address';
          });
  });

  // Function to break down address to search
  window.searchAddress = function () {
      var address = document.getElementById("address-input").value.trim();
      if (!address) return alert("Please enter an address!");

      // Ensure correct format (e.g., replace spaces with "+" or enforce country suffix)
      address = address.replace(/\s+/g, '+') + ", Pakistan";  // Forces search within Pakistan

      console.log("Formatted Address:", address); // Print formatted address before request

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
          .then(response => response.json())
          .then(data => {
              if (data.length > 0) {
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  setMarker(lat, lon, data[0].display_name);
              } else {
                  alert("Address not found!");
              }
          })
          .catch(() => alert("Error finding address!"));
  };

});
