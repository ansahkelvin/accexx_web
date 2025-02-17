import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
    interface Window {
        google: {
            maps: {
                Map: typeof google.maps.Map;
                Marker: typeof google.maps.Marker;
                places: {
                    Autocomplete: typeof google.maps.places.Autocomplete;
                };
                Geocoder: typeof google.maps.Geocoder;
                event: typeof google.maps.event;
            };
        };
        initMap?: () => void;
    }
}

interface FormData {
    address: string;
    latitude: string;
    longitude: string;
}

interface StepComponentProps {
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Record<string, string>;
    renderError: (field: string) => React.ReactNode;
}

type UpdateFormDataFunction = (address: string, lat: number, lng: number) => void;

const LocationStep: React.FC<StepComponentProps> = ({ formData, handleInputChange, errors, renderError }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const updateFormData: UpdateFormDataFunction = useCallback((
        address: string,
        lat: number,
        lng: number
    ): void => {
        handleInputChange({
            target: { name: 'address', value: address }
        } as React.ChangeEvent<HTMLInputElement>);

        handleInputChange({
            target: { name: 'latitude', value: lat.toString() }
        } as React.ChangeEvent<HTMLInputElement>);

        handleInputChange({
            target: { name: 'longitude', value: lng.toString() }
        } as React.ChangeEvent<HTMLInputElement>);
    }, [handleInputChange]);

    const initializeGoogleMaps = useCallback(async () => {
        if (typeof window.google !== 'undefined') return;
        if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) return;

        return new Promise<void>((resolve, reject) => {
            // Check again just before adding the script
            if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
                resolve();
                return;
            }

            window.initMap = () => resolve();

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
        });
    }, []);

    const getUserLocation = useCallback((): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }, []);

    useEffect(() => {
        let isSubscribed = true;

        const initialize = async () => {
            try {
                if (!mapRef.current || !inputRef.current) return;

                // Initialize Google Maps if not already initialized
                await initializeGoogleMaps();

                // Get initial position
                let initialPosition: google.maps.LatLngLiteral = {
                    lat: 40.7128,
                    lng: -74.0060
                };

                try {
                    const position = await getUserLocation();
                    initialPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                } catch (error) {
                    console.warn('Using default location:', error);
                }

                // Initialize map if not already initialized
                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                        center: initialPosition,
                        zoom: 15,
                        mapTypeControl: false,
                    });

                    markerRef.current = new window.google.maps.Marker({
                        map: mapInstanceRef.current,
                        position: initialPosition,
                        visible: true
                    });

                    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                        fields: ['formatted_address', 'geometry']
                    });

                    autocompleteRef.current.bindTo('bounds', mapInstanceRef.current);

                    // Set up autocomplete listener
                    autocompleteRef.current.addListener('place_changed', () => {
                        if (!autocompleteRef.current || !mapInstanceRef.current || !markerRef.current) return;

                        const place = autocompleteRef.current.getPlace();

                        if (!place.geometry?.location) {
                            setMapError('Please select a location from the dropdown');
                            return;
                        }

                        setMapError(null);

                        mapInstanceRef.current.setCenter(place.geometry.location);
                        markerRef.current.setPosition(place.geometry.location);
                        mapInstanceRef.current.setZoom(17);

                        if (isSubscribed) {
                            updateFormData(
                                place.formatted_address ?? '',
                                place.geometry.location.lat(),
                                place.geometry.location.lng()
                            );
                        }
                    });
                }

                // Get initial address through reverse geocoding
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: initialPosition }, (results, status) => {
                    if (status === 'OK' && results?.[0] && isSubscribed) {
                        updateFormData(
                            results[0].formatted_address,
                            initialPosition.lat,
                            initialPosition.lng
                        );
                    }
                });

            } catch (error) {
                console.error('Error initializing map:', error);
                setMapError('Error loading Google Maps');
            }
        };

        initialize();

        return () => {
            isSubscribed = false;
            if (window.initMap && !document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
                delete window.initMap;
            }
        };
    }, [initializeGoogleMaps, getUserLocation, updateFormData]);

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="address">Location</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                        <MapPin className="h-5 w-5" />
                    </span>
                    <Input
                        ref={inputRef}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`rounded-l-none ${errors.address ? "border-red-500" : ""}`}
                        placeholder="Search for a location"
                    />
                </div>
                {renderError('address')}
            </div>

            <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border border-gray-300"
            />

            {mapError && (
                <Alert variant="destructive">
                    <AlertDescription>{mapError}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default LocationStep;