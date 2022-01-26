import React, {useContext, useState} from 'react';
import {AuthContext} from '../../shared/context/auth-context';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from "../../shared/hooks/http-hook";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import './Auth.css';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUploads from "../../shared/components/FormElements/ImageUploads";

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
        },
        false,
    )

    const authSubmitHandler = async e => {
        e.preventDefault();
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {

            }
        } else {
            try {
                const data = new FormData();
                data.append('name', formState.inputs.name.value);
                data.append('email', formState.inputs.email.value);
                data.append('password', formState.inputs.password.value);
                data.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    `users/signup`,
                    'POST',
                    data,
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {

            }
        }
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined,
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false,
                },
                image: {
                    value: null,
                    isValid: false,
                }
            }, false)
        }
        setIsLoginMode(prev => !prev);
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                <h2>Login Required</h2>
                <hr/>
                <form onSubmit={authSubmitHandler}>
                    {
                        !isLoginMode && (
                            <>
                                <Input
                                    id="name"
                                    element="input"
                                    type="text"
                                    label="Name"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a name"
                                    onInput={inputHandler}
                                />
                                <ImageUploads
                                    center id='image'
                                    onInput={inputHandler}
                                    errorText='Please provide an avatar'
                                />
                            </>
                        )
                    }
                    <Input
                        id="email"
                        element="input"
                        type="text"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Check your mail"
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Check your password (min length 6 characters)"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </>
    )
}

export default Auth;