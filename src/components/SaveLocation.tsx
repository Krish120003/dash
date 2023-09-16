import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { LocationType } from '@prisma/client';
import { api } from '~/utils/api';




const SaveLocation: React.FC = () => {
    const [selectedLocationType, setSelectedLocationType] = useState<string>(''); // State to store the selected location


    const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates>();
    const [error, setError] = useState<string>();
    const saveLocation = api.location.saveLocation.useMutation();
    const [radius, setRadius] = useState<number>(100);



    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation(position.coords);
            },
            (error) => {
                setError(error.message);
            }
        );
    }, []);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // write to db using trpc endpiont
        console.log(selectedLocationType)
        const type = selectedLocationType === "Home" ? LocationType.HOME : selectedLocationType === "Work" ? LocationType.WORK : LocationType.SCHOOL;
        if (currentLocation?.latitude && currentLocation?.longitude) {
            await saveLocation.mutateAsync({ type: type, coordinates: { latitude: currentLocation.latitude, longitude: currentLocation.longitude }, radius: radius })
        }
    };

    return (
        <form onSubmit={void handleSubmit}>
            <label>
                Select a Location:
                <select value={selectedLocationType} onChange={(e) => setSelectedLocationType(e.target.value)}>
                    <option value="">-- Select a location --</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="School">School</option>
                </select>
            </label>
            <label>
                Radius:
                <input type="number" name="radius" onChange={(e) => setRadius(Number.parseInt(e.target.value))} />
            </label>

            <button type="submit">Save Location</button>
        </form>
    );
};

export default SaveLocation;
