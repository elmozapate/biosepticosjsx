import { ObjContacto } from "@/bioApp/models/modelosUsuario";
import { useEffect } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = (props) => {
    const { fullAdressSearch = false, adressView = { state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false }, setAdressView = console.log, onAddressSelect, setMapCenter = console.log, inAdressAdd = false, adressData = ObjContacto.direccion } = props
    const {
        ready,
        value = adressData,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: { componentRestrictions: { country: 'co' } },
        debounce: 300,
        cache: 86400,
    });
    const geocoder = new google.maps.Geocoder();
    const getLocation = (place_id) => {
        geocoder.geocode({ placeId: place_id })
            .then(({ results }) => {
                setMapCenter({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
                inAdressAdd && setAdressView({
                    ...adressView,
                    centre: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() },
                    map: true,
                })
                /*  map.setZoom(11);
                 map.setCenter(results[0].geometry.location);
                 // Set the position of the marker using the place ID and location.
                 // @ts-ignore TODO This should be in @typings/googlemaps.
                 marker.setPlace({
                     placeId: place.place_id,
                     location: results[0].geometry.location,
                 });
                 marker.setVisible(true);
                 infowindowContent.children["place-name"].textContent = place.name;
                 infowindowContent.children["place-id"].textContent = place.place_id;
                 infowindowContent.children["place-address"].textContent =
                     results[0].formatted_address;
                 infowindow.open(map, marker); */
            })
            .catch((e) => console.log("Geocoder failed due to: " + e));
    }
    const renderSuggestions = () => {
        return data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
                description,
            } = suggestion;

            return (
                <li
                    key={place_id}
                    onClick={() => {
                        setValue(description, false);
                        clearSuggestions();
                        onAddressSelect && onAddressSelect(description);
                        getLocation(place_id)
                    }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    };
    inAdressAdd && useEffect(() => {
        setValue(adressData.otros.length > 3 && !fullAdressSearch ? adressData.otros : `${adressData.departamento} ${adressData.ciudad} ${adressData.barrio} ${adressData.viaSelecionada} ${adressData.numero} ${adressData.letra} ${adressData.primerNumDireccion} ${adressData.primerLetra} ${adressData.segundoNumDireccion} ${adressData.segundaLetra}`)
    }, [adressData])
    return (
        <div className={''}>
            {!inAdressAdd && <input
                value={value}
                className={''}
                disabled={!ready}
                onChange={(e) => setValue(e.target.value)}
                placeholder="INGRESA UNA DIRECCION"
            />}

            {status === 'OK' && (
                <ul className={''}>{renderSuggestions()}</ul>
            )}
        </div>
    );
};
export default PlacesAutocomplete