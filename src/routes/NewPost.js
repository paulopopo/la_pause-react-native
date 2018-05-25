import React, {Component} from 'react';
import {AsyncStorage, Text, Button, View} from 'react-native';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import TextField from "../components/TextField";

const defaultState = {
    values: {
        title: '',
        text: '',
    },
    errors: {},
    isSubmitting: false,
};

class NewPost extends Component {
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
            response = await this.props.createPostMutation({
                variables: this.state.values,
            });
        } catch (err) {
            console.log(err);
            this.setState({
                errors: {
                    text: 'mail error',
                },
                isSubmitting: false,
            });
            return;
        }

        this.props.history.push('/feed');
    };

    goToSignup = () => {
        this.props.history.push('/signup');
    }

    render() {
        const {errors, values: {title, text}} = this.state;
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
                    {errors.title && <Text style={{color: 'red'}}>{errors.title}</Text>}
                    <TextField value={title} name="title" onChangeText={this.onChangeText}/>
                    {errors.text && <Text style={{color: 'red'}}>{errors.text}</Text>}
                    <TextField
                        value={text}
                        name="text"
                        onChangeText={this.onChangeText}
                    />

                    <Button style={{maringTop: 10}} title="create" onPress={this.submit}/>

                    <Button style={{maringTop: 10}} title="feed"
                            onPress={() => this.props.history.push('/feed')}/>
                </View>
            </View>
        );
    }
}

const CREATE_POST_MUTATION = gql`
    mutation CreatePostMutation($title: String!, $text: String!) {
        createPost(title: $title, text: $text) {
            id
            title
            text
        }
    }
`

export default graphql(CREATE_POST_MUTATION, {name: 'createPostMutation'})(NewPost);
