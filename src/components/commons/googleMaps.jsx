import { useLoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import PlacesAutocomplete from './placesAutoComplete';
import { Socket } from "@/middleware/routes/connect/socket/socketOn"


const socket = Socket


const GooglMapsComp = (props) => {
    let start = false
    const { visorObj = {}, setEnviar = console.log, enviar = { aReady: false, bReady: false, cReady: false, b: console.log, a: console.log, c: console.log, allReady: false }, rastreado = false, normal = false, receptor = false, mapCenterGo = { inicio: { lat: 27.672932021393862, lng: 85.31184012689732 }, final: { lat: 27.672932021393862, lng: 85.31184012689732 } }, irALugar = console.log, setMapCenterFuntion = console.log, mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 }, setMapCenter = console.log } = props
    const libraries = useMemo(() => ['places'], []);
    let map = false
    const mapOptions = {
        disableDefaultUI: true,
        clickableIcons: true,
        scrollwheel: false,
        zoomControl: true
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDNqyPEwK3t5FMGBYrRuvVGp8hyN7uaJ8c',
        libraries: libraries,
    });

    if (!isLoaded) {
        return <p>Loading...</p>;
    }
    const rastrear = () => {
        /*   socket.on("bioApp", (msg) => {
              const actionTodo = msg.actionTodo
              const Data = msg.dataIn
              switch (actionTodo) {
                  case 'dataRes-userRastreado':
                      console.log('recibes');
                      if (receptor) {
                          console.log('recibe');
                          setMapCenter({ lat: Data.lat, lng: Data.lng })
                      }
                      break;
                  default:
                      break;
              }
          }) */
    }
    const loadDragInfo = (evt) => {
        if (receptor) {
            console.log({ lat: evt.latLng.lat(), lng: evt.latLng.lng() });
        }
        if (rastreado) {
            setMapCenter({ lat: evt.latLng.lat(), lng: evt.latLng.lng() })

            socket.emit('bioSepticosMap', {
                'dataIn': { lat: evt.latLng.lat(), lng: evt.latLng.lng() },
                actionTodo: "userObjLocationMove",
                type: 'obj',
                ...visorObj,
                ip:visorObj.ip,
                id:visorObj.id,
            });
        }
        if (normal) {
            setMapCenter({ lat: evt.latLng.lat(), lng: evt.latLng.lng() })
        }

/*         map.panTo(evt.latLng);
*/    }
    const IrAplace = () => {
        map = map ? map : new google.maps.Map(document.getElementById('map-google'), mapOptions);
        let directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
        let directionsService = new google.maps.DirectionsService;

        let request = {
            origin: { ...mapCenterGo.inicio },
            destination: { ...mapCenterGo.final },
            optimizeWaypoints: true,
            waypoints: [],
            travelMode: google.maps.DirectionsTravelMode['DRIVING'],
            unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
            provideRouteAlternatives: true
        };
        directionsService.route(request, function (response, status) {
            console.log(status);
            if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);
                let route = response.routes[0];
                let duration = 0;

                route.legs.forEach(function (leg) {
                    // The leg duration in seconds.
                    duration += leg.duration.value;
                });
                directionsDisplay.setMap(map)
                directionsDisplay.setDirections(response);
            } else {
/*              alert("No existen rutas entre ambos puntos");
 */          }
        });
        // Request route directions

        /*   directionsService.route({
              origin: { lat: mapCenterGo.inicio.lat, lng: mapCenterGo.inicio.lng },
              destination: { lat: mapCenterGo.final.lat, lng: mapCenterGo.final.lng },
              travelMode: google.maps.TravelMode.DRIVING
          }, function (response, status) {
              console.log(response, status);
              if (status === google.maps.DirectionsStatus.OK) {
  
                  // Get first route duration
                  let route = response.routes[0];
                  let duration = 0;
  
                  route.legs.forEach(function (leg) {
                      // The leg duration in seconds.
                      duration += leg.duration.value;
                  });
                  directionsDisplay.setDirections(response);
                  console.log(duration, response);
              } else {
                  console.log(status);
          }
          }); */
    }
   

    return (
        <div className={'styles.homeWrapper'}>
            <GoogleMap
                onClick={(e) => console.log(e, 'MapaClick')}
                options={mapOptions}
                zoom={14}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '800px', height: '500px' }}
                onLoad={() => console.log('Map Component Loaded...')}
                id={'map-google'}
            >
                <MarkerF
                    draggable={true}
                    position={mapCenter}
                    onDragEnd={loadDragInfo}
                    onLoad={() => console.log('Marker Loaded')}
                />
                {!receptor && !rastreado && < DirectionsRenderer />}

            </GoogleMap>
            {!receptor && !rastreado && <>
                <PlacesAutocomplete setMapCenter={setMapCenter} />
                <PlacesAutocomplete setMapCenter={setMapCenterFuntion} />
            </>}

            {/* <DirectionsRenderer /> */}

            {!receptor && !rastreado && <button onClick={(e) => { e.preventDefault(); IrAplace() }}>LLEGAR</button>}
            {
                receptor && <><button onClick={(e) => { e.preventDefault(); rastrear() }}>rastrear</button></>
            }
        </div>
    );
};
export default GooglMapsComp;