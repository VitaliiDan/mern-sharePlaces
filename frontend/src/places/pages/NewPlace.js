import React, {useContext} from 'react';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from "../../shared/hooks/http-hook";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {useHistory} from "react-router-dom";
import ImageUploads from "../../shared/components/FormElements/ImageUploads";

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
            address: {
                value: '',
                isValid: false,
            },
            image: {
                value: null,
                isValid: false,
            }
        },
        false,
    )

    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formState.inputs.title.value);
            data.append('description', formState.inputs.description.value);
            data.append('address', formState.inputs.address.value);
            data.append('image', formState.inputs.image.value);
            await sendRequest(
                'places',
                'POST',
                data,
                {
                    Authorization: `Bearer ${auth.token}`
                }
            )
            history.push('/')
        } catch (err) {
        }
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
            <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)"
                    onInput={inputHandler}
                />
                <ImageUploads
                    id='image'
                    onInput={inputHandler}
                    errorText='Please Provide an image.'
                />
                <Input
                    id="address"
                    element="input"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </>
    )
};

export default NewPlace;