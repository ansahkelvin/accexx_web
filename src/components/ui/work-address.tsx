// components/registration/WorkAddressForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface FormDataType {
    work_address: string;
    work_address_latitude: number;
    work_address_longitude: number;
}

interface WorkAddressFormProps {
    formData: FormDataType;
    updateFormData: (data: Partial<FormDataType>) => void;
    errors: Record<string, string>;
}

const WorkAddressForm: React.FC<WorkAddressFormProps> = ({ formData, updateFormData, errors }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);

    // Initialize Google Maps and Places API
    useEffect(() => {
        const initMap = async () => {
            try {
                const mapLoader = new Loader({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                    version: "weekly",
                    libraries: ["places"]
                });

                const google = await mapLoader.load();

                // Create the map
                if (mapRef.current) {
                    const defaultLocation = { lat: 51.507351, lng: -0.127758 }; // London

                    const map = new google.maps.Map(mapRef.current, {
                        center: defaultLocation,
                        zoom: 11,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                    });

                    googleMapRef.current = map;

                    // Create marker
                    const marker = new google.maps.Marker({
                        map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                    });
                    markerRef.current = marker;

                    // Set marker if we already have location data
                    if (formData.work_address_latitude && formData.work_address_longitude) {
                        const position = {
                            lat: formData.work_address_latitude,
                            lng: formData.work_address_longitude
                        };
                        marker.setPosition(position);
                        map.setCenter(position);
                        marker.setVisible(true);
                    } else {
                        marker.setVisible(false);
                    }

                    // Marker drag event
                    marker.addListener("dragend", () => {
                        const position = marker.getPosition();
                        if (position) {
                            updateMarkerPosition(position.lat(), position.lng());

                            // Get address from coordinates (reverse geocoding)
                            const geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ location: position }, (results, status) => {
                                if (status === "OK" && results && results[0]) {
                                    updateFormData({
                                        work_address: results[0].formatted_address
                                    });
                                }
                            });
                        }
                    });

                    // Initialize Autocomplete
                    if (autocompleteInputRef.current) {
                        const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
                            fields: ["formatted_address", "geometry", "name"],
                            types: ["establishment", "geocode"]
                        });

                        // Bias results to the map's viewport
                        autocomplete.bindTo("bounds", map);

                        autocomplete.addListener("place_changed", () => {
                            const place = autocomplete.getPlace();

                            if (!place.geometry || !place.geometry.location) {
                                setMapError("No location data for this place. Please try another.");
                                return;
                            }

                            setMapError(null);

                            // If the place has a geometry, then present it on a map
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);
                            }

                            marker.setPosition(place.geometry.location);
                            marker.setVisible(true);

                            const address = place.formatted_address || "";
                            updateFormData({
                                work_address: address,
                                work_address_latitude: place.geometry.location.lat(),
                                work_address_longitude: place.geometry.location.lng()
                            });
                        });
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error loading Google Maps:', error);
                setMapError('Failed to load Google Maps. Please check your internet connection and try again.');
                setIsLoading(false);
            }
        };

        initMap();
    }, []);

    // Update coordinates in form data when marker is moved
    const updateMarkerPosition = (lat: number, lng: number) => {
        updateFormData({
            work_address_latitude: lat,
            work_address_longitude: lng
        });
    };

    // Get user's current location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    if (googleMapRef.current && markerRef.current) {
                        googleMapRef.current.setCenter(userLocation);
                        googleMapRef.current.setZoom(15);
                        markerRef.current.setPosition(userLocation);
                        markerRef.current.setVisible(true);

                        // Perform reverse geocoding to get address
                        const geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ location: userLocation }, (results, status) => {
                            if (status === "OK" && results && results[0]) {
                                updateFormData({
                                    work_address: results[0].formatted_address,
                                    work_address_latitude: userLocation.lat,
                                    work_address_longitude: userLocation.lng
                                });
                            } else {
                                updateFormData({
                                    work_address_latitude: userLocation.lat,
                                    work_address_longitude: userLocation.lng
                                });
                            }
                            setIsLoading(false);
                        });
                    }
                },
                (error) => {
                    setMapError(`Error getting your location: ${error.message}`);
                    setIsLoading(false);
                }
            );
        } else {
            setMapError("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Work Location</h2>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            ref={autocompleteInputRef}
                            type="text"
                            placeholder="Search for your clinic or hospital..."
                            value={formData.work_address}
                            onChange={(e) => updateFormData({ work_address: e.target.value })}
                            className={`block w-full pl-10 pr-3 py-2 border ${errors.work_address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={getUserLocation}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <MapPin className="h-4 w-4 mr-2" /> Use My Location
                    </button>
                </div>

                {errors.work_address && (
                    <p className="text-sm text-red-600">{errors.work_address}</p>
                )}

                {mapError && (
                    <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">
                        {mapError}
                    </div>
                )}

                {/* Map Container */}
                <div className="relative rounded-lg overflow-hidden border border-gray-300 bg-gray-100" style={{ height: '300px' }}>
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                            <span className="ml-2 text-indigo-600 font-medium">Loading map...</span>
                        </div>
                    )}
                    <div ref={mapRef} className="w-full h-full"></div>
                </div>

                {formData.work_address && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <h3 className="text-sm font-medium text-blue-800">Selected Location</h3>
                        <p className="mt-1 text-sm text-blue-700">{formData.work_address}</p>
                        <p className="text-xs text-blue-500 mt-1">
                            Coordinates: {formData.work_address_latitude.toFixed(6)}, {formData.work_address_longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-blue-600 mt-2 italic">
                            You can drag the pin on the map to adjust the exact location
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkAddressForm;