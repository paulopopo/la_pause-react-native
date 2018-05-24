import React from 'react';
import {AsyncStorage, Text, Button, View} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import TextField from '../components/TextField';
import {TOKEN_KEY} from '../../constants';

const defaultState = {
    values: {
        email: '',
        password: '',
    },
    errors: {},
    isSubmitting: false,
};

class Login extends React.Component {
    state = defaultState;
    
    onChangeText = (key, value) => {
        this.setState(state => ({
            values: {
                ...state.values,
                [key]: value,
            },
        }));
    };
    
    submit = async () => {
        
        if (this.state.isSubmitting) {
            return;
        }
        console.log("login...");
        this.setState({isSubmitting: true});
        let response
        try {
            response = await this.props.loginMutation({
                variables: this.state.values,
            });
        } catch (err) {
            console.log(err);
            this.setState({
                errors: {
                    email: 'mail error',
                },
                isSubmitting: false,
            });
            return;
        }
        const {token, error} = response.data.login;
        await AsyncStorage.setItem(TOKEN_KEY, token);
        // this.setState(defaultState);
        this.props.history.push('/feed');
    };
    
    goToSignup = () => {
        this.props.history.push('/signup');
    };
    
    render() {
        const {errors, values: {email, password}} = this.state;
        
        return (
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={{width: 200}}>
                    {errors.email && <Text style={{color: 'red'}}>{errors.email}</Text>}
                    <TextField value={email} name="email" onChangeText={this.onChangeText}/>
                    {errors.password && <Text style={{color: 'red'}}>{errors.password}</Text>}
                    <TextField
                        value={password}
                        name="password"
                        onChangeText={this.onChangeText}
                        secureTextEntry
                    />
                    <Button title="Login" onPress={this.submit}/>
                    <Text style={{textAlign: 'center'}}>or</Text>
                    <Button title="Create account" onPress={this.goToSignup}/>
                </View>
            </View>
        );
    }
}

const LOGIN_USER_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                name
                email
            }
        }
    }
`
export default graphql(LOGIN_USER_MUTATION, {name: 'loginMutation'})(Login);
