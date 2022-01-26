import React, {useEffect, useState} from 'react';
import PlaceList from '../components/PlaceLIst';
import {useParams} from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = props => {
    const [loadedPlaces, setLoadedPLaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`places/user/${userId}`)
                setLoadedPLaces(responseData.places)
            } catch (e) {
            }
        }
        fetchPlaces();
    }, [sendRequest, userId])

    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPLaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <div className='center'><LoadingSpinner/></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
        </>
    )
}

export default UserPlaces;