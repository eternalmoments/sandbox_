import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function PlacesAutocomplete({ onPlaceSelect }: PlacesAutocompleteProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [inputValue, setInputValue] = useState('');
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'formatted_address'],
        types: ['geocode', 'establishment']
      });

      autoCompleteRef.current.addListener('place_changed', () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place) {
          setInputValue(place.formatted_address || '');
          onPlaceSelect(place);
        }
      });
    }
  }, [isLoaded, onPlaceSelect]);

  if (!isLoaded) return <div>Carregando...</div>;

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Coloque sua localização"
        className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}