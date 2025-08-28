import { useLoadScript, GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import PlacesAutocomplete from './placesAutoComplete';
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { ObjContacto } from '@/bioApp/models/modelosUsuario';


const socket = Socket


const GooglMapsComp = (props) => {
    let start = false
    const { inMapSelect = false, inTimes = 0, times = [[]], setTimes = console.log, irPlace = {
        funtionOk: false, using: false, state: false, go: false, coordenadas: { obra: '', position: -1, lat: 6.2476376, lng: -75.56581530000001 }, coordenadasInicial: { obra: '', position: -1, lat: 6.2476376, lng: -75.56581530000001 }, funtion: console.log
    }, goPlace = { funtionOk: false, go: false, ok: false, state: false, funtion: console.log }, setIrPlace = console.log, setGoPlace = console.log, adressViewIn = false, fullAdressSearch = false, adressView = { state: false, centre: { ltn: 6.1576585, lgn: -75872710271 } }, setAdressView = console.log, soloAdress = false, adressData = ObjContacto.direccion, visorObj = {}, setEnviar = console.log, enviar = { aReady: false, bReady: false, cReady: false, b: console.log, a: console.log, c: console.log, allReady: false }, rastreado = false, normal = false, receptor = false, mapCenterGo = { inicio: { lat: 27.672932021393862, lng: 85.31184012689732 }, final: { lat: 27.672932021393862, lng: 85.31184012689732 } }, irALugar = console.log, setMapCenterFuntion = console.log, mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 }, setMapCenter = console.log } = props
    const libraries = useMemo(() => ['places'], []);
    let map = false
    const mapOptions = {
        disableDefaultUI: true,
        clickableIcons: true,
        scrollwheel: false,
        zoomControl: true
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBE0Y1gpJ-P0Fu_hPUEP-mBrlu7fQFBWsQ',
        libraries: libraries,
    });

    if (!isLoaded) {
        return <p>Loading...</p>;
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
                ip: visorObj.ip,
                id: visorObj.id,
                reqId: parseInt(Math.random() * 999999)
            });
        }
        if (normal) {
            setMapCenter({ lat: evt.latLng.lat(), lng: evt.latLng.lng() })
        }
        if (inMapSelect) {
            setMapCenter({ lat: evt.latLng.lat(), lng: evt.latLng.lng() })
        }
    }
    const IrAplace = async () => {
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
            if (status == google.maps.DirectionsStatus.OK) {
                let route = response.routes[0];
                let duration = 0;
                let distance = 0;
                route.legs.forEach(function (leg) {
                    // The leg duration in seconds.
                    duration += leg.duration.value;
                    distance += leg.distance.value
                });
                !irPlace.using && directionsDisplay.setMap(map)
                !irPlace.using && directionsDisplay.setDirections(response);
                let alltime = times
                !times[(irPlace.coordenadasInicial.obra === 'userPosition' ? 0 : irPlace.coordenadasInicial.position + 1)] && alltime.push([])
                let oldTimes = alltime[(irPlace.coordenadasInicial.obra === 'userPosition' ? 0 : irPlace.coordenadasInicial.position + 1)]
                oldTimes.push({ obraInicio: { obra: irPlace.coordenadasInicial.obra, position: irPlace.coordenadasInicial.position }, obraFinal: { obra: irPlace.coordenadas.obra, position: irPlace.coordenadas.position }, time: duration, distance: distance, timeInMin: `${parseInt(duration / 60)} : ${(duration - (parseInt(duration / 60) * 60))}` })
                alltime[(irPlace.coordenadasInicial.obra === 'userPosition' ? 0 : irPlace.coordenadasInicial.position + 1)] = oldTimes
                setTimes(alltime)
                setGoPlace({
                    ...goPlace,
                    ok: true
                })

            } else {
/*              alert("No existen rutas entre ambos puntos");
 */          }
        });
    }
    if (!goPlace.funtionOk) {
        setGoPlace({
            ...goPlace,
            funtionOk: true,
            funtion: IrAplace
        })
    }
    if (!irPlace.funtionOk) {
        setIrPlace({
            ...irPlace,
            funtionOk: true,
            funtion: IrAplace
        })
    }
    return (
        <>
            {!irPlace.using && soloAdress ? <PlacesAutocomplete fullAdressSearch={fullAdressSearch} inAdressAdd setAdressView={setAdressView} adressView={adressView} adressData={adressData}/* setMapCenter={setMapCenter} */ />
                : <div className={`styles.homeWrapper ${irPlace.using ? 'hidden' : ''}`}>
                    <GoogleMap
                        onClick={(e) => {
                            console.log(e);
                        }}
                        options={mapOptions}
                        zoom={inMapSelect ? 14 : adressViewIn ? 17.5 : adressView.state ? 17 : 14}
                        center={adressView.state ? adressView.centre : mapCenter}
                        mapTypeId={google.maps.MapTypeId.ROADMAP}
                        mapContainerStyle={{ width: inMapSelect ? '320px' : (adressViewIn || adressView.state) ? '300px' : '800px', height: inMapSelect ? '320px' : (adressViewIn || adressView.state) ? '300px' : '500px' }}
                        /* onLoad={() => console.log('Map Component Loaded...')} */
                        id={'map-google'}
                    >
                        {!irPlace.using && <MarkerF
                            draggable={adressViewIn ? false : true}
                            position={adressViewIn ? mapCenter : adressView.state ? adressView.centre : mapCenter}
                            onDragEnd={loadDragInfo}
                        /* onLoad={() => console.log('Marker Loaded')} */
                        />}
                        {!irPlace.using && !adressViewIn && !receptor && !rastreado && < DirectionsRenderer />}

                    </GoogleMap>
                    {!inMapSelect && !adressViewIn && !receptor && !rastreado && !adressView.state && <>
                        <PlacesAutocomplete setMapCenter={setMapCenter} />
                        <PlacesAutocomplete setMapCenter={setMapCenterFuntion} />
                    </>}
                    {inMapSelect && <>
                        <PlacesAutocomplete setMapCenter={setMapCenterFuntion} />
                    </>}
                    {/* <DirectionsRenderer /> */}

                    {!inMapSelect && !adressViewIn && !receptor && !rastreado && !adressView.state && <button onClick={(e) => { e.preventDefault(); IrAplace() }}>LLEGAR</button>}
                    {/*  {
                        receptor && <><button onClick={(e) => { e.preventDefault(); rastrear() }}>rastrear</button></>
                    } */}
                </div>}
        </>
    );
};
export default GooglMapsComp;