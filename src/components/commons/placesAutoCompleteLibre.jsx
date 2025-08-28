'use client';

import { useEffect, useRef } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { ObjContacto } from '@/bioApp/models/modelosUsuario';

const PlacesAutocompleteLibre = (props) => {
  const {
    fullAdressSearch = false,
    adressView = { state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false },
    setAdressView = console.log,
    onAddressSelect,
    setMapCenter = console.log,
    inAdressAdd = false,
    adressData = ObjContacto.direccion,
  } = props;

  // Hook de sugerencias (está OK llamarlo siempre; `ready` será false hasta que Google esté cargado)
  const {
    ready,
    value,                // string controlado por el hook
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'co' } },
    debounce: 300,
    cache: 86400,
  });

  // Geocoder seguro
  const geocoderRef = useRef(null);

  // Carga Google Maps JS API de forma asíncrona (una sola vez)
  useEffect(() => {
    let cancelled = false;

    async function ensureGoogle() {
      // Si ya existe (por LoadScript externo u otro loader), úsalo
      if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
        if (!cancelled) geocoderRef.current = new window.google.maps.Geocoder();
        return;
      }

      const loader = new Loader({
        apiKey:'AIzaSyBE0Y1gpJ-P0Fu_hPUEP-mBrlu7fQFBWsQ',
        libraries: ['places'],
        version: 'weekly',
      });

      try {
        await loader.load();
        if (!cancelled && window.google?.maps?.Geocoder) {
          geocoderRef.current = new window.google.maps.Geocoder();
        }
      } catch (e) {
        // Puedes manejar el error de carga aquí si lo deseas
        // console.error('Error cargando Google Maps:', e);
      }
    }

    ensureGoogle();
    return () => {
      cancelled = true;
    };
  }, []);

  // Inicializa el valor del input a partir de adressData (cuando estés en modo "add")
  useEffect(() => {
    if (!inAdressAdd) return;

    const texto =
      adressData.otros && (adressData.otros.length > 3 || !fullAdressSearch)
        ? adressData.otros
        : `${adressData.departamento || ''} ${adressData.ciudad || ''} ${adressData.barrio || ''} ${adressData.viaSelecionada || ''} ${adressData.numero || ''} ${adressData.letra || ''} ${adressData.primerNumDireccion || ''} ${adressData.primerLetra || ''} ${adressData.segundoNumDireccion || ''} ${adressData.segundaLetra || ''}`.trim();

    // Solo setea si hay texto distinto (evita loops)
    if (texto && texto !== value) setValue(texto, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAdressAdd, adressData, fullAdressSearch]);

  // Geocodifica por place_id y devuelve coords hacia afuera
  const getLocation = (place_id) => {
    const geocoder = geocoderRef.current;
    if (!geocoder) return; // aún no cargó Google

    geocoder
      .geocode({ placeId: place_id })
      .then(({ results }) => {
        if (!results?.[0]?.geometry?.location) return;
        const loc = results[0].geometry.location;
        const coords = { lat: loc.lat(), lng: loc.lng() };

        setMapCenter(coords);

        if (inAdressAdd) {
          setAdressView({
            ...adressView,
            centre: coords,
            map: true,
          });
        }
      })
      .catch((e) => {
        console.log('Geocoder failed due to:', e);
      });
  };

  // Render de sugerencias
  const renderSuggestions = () =>
    data.map((suggestion) => {
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
            getLocation(place_id);
          }}
          style={{ cursor: 'pointer', padding: '6px 8px' }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div>
      {/* Si NO estás en modo "add", muestra el input para escribir libremente */}
      {!inAdressAdd && (
        <input
          value={value || ''}     // asegúrate de que sea string
          disabled={!ready}
          onChange={(e) => setValue(e.target.value)}
          placeholder="INGRESA UNA DIRECCIÓN"
          style={{ width: '100%', padding: 8 }}
        />
      )}

      {/* Lista de sugerencias */}
      {status === 'OK' && <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>{renderSuggestions()}</ul>}
    </div>
  );
};

export default PlacesAutocompleteLibre;
