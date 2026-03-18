
    window.onload = function() {
    maptilersdk.config.apiKey = mapApiKey;
    const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
  center: JSON.parse(coordinates).map(Number),  //starting position [lng, lat]
  zoom: 6
});
    
     console.log(coordinates);
    new maptilersdk.Marker({color:"red"})
    .setLngLat(JSON.parse(coordinates).map(Number))
    .setPopup(new maptilersdk.Popup({offset: 25})
    .setHTML(`<p>Exact location provided after booking</p>`))
    .addTo(map);
    };


