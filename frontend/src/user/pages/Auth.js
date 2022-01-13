import React, {useContext, useState} from 'react';
import {AuthContext} from '../../shared/context/auth-context';
import {useForm} from '../../shared/hooks/form-hook';
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	
	const [isLoginMode, setIsLoginMode] = useState(true);
	
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
	
	const authSubmitHandler = (e) => {
		e.preventDefault()
		console.log('auth')
		auth.login();
	}
	
	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData({
				...formState.inputs,
				name: undefined,
			}, formState.inputs.email.isValid && formState.inputs.password.isValid);
		} else {
			setFormData({
				...formState.inputs,
				name: {
					value: '',
					isValid: false,
				}
			}, false)
		}
		setIsLoginMode(prev => !prev);
	}
	
	return (
		<Card className="authentication">
			<h2>Login Required</h2>
			<hr/>
			<form onSubmit={authSubmitHandler}>
				{
					!isLoginMode &&
					<Input
						id="name"
						element="input"
						type="text"
						label="Name"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a name"
						onInput={inputHandler}
					/>
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
	)
}

export default Auth;