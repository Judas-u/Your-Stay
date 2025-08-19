mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'red', rotation: 0 })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${listing.title}</h3><p>Exact Location provided after booking</p>`
    )
  )
  .addTo(map);
