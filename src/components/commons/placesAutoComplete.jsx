import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = (props) => {
    const { onAddressSelect, setMapCenter = console.log } = props
    const {
        ready,
        value,
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
                console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                setMapCenter({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
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
                        console.log(description, place_id);
                        onAddressSelect && onAddressSelect(description);
                        getLocation(place_id)
                    }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    };

    return (
        <div className={''}>
            <input
                value={value}
                className={''}
                disabled={!ready}
                onChange={(e) => setValue(e.target.value)}
                placeholder="INGRESA UNA DIRECCION"
            />

            {status === 'OK' && (
                <ul className={''}>{renderSuggestions()}</ul>
            )}
        </div>
    );
};
export default PlacesAutocomplete