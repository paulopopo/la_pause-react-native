import React, {Component, Fragment} from 'react'
import {graphql, compose} from 'react-apollo'
import {gql} from 'apollo-boost'
import {FlatList, Text, View, StyleSheet, Button} from "react-native";

const styles = StyleSheet.create({
    separator: {
        marginTop: 5
    },
});

const Post = (props) => {

    return <View>
        <Text style={{color: 'red', fontSize: 30}}>{props.post.title}</Text>
        <Text style={{color: 'red', fontSize: 20}}>{props.post.text}</Text>

        {props.post.likes ? (
                <Text> Like : {props.post.likes.map(elt => elt.name).join(' - ')}</Text>) :
            <Text> - </Text>}

        <Button title="Like" onPress={() => props.onLikeClick(props.post.id)}/>
    </View>
}

class Feed extends Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.location.key !== nextProps.location.key) {
            this.props.feedQuery.refetch()
        }
    }

    componentDidMount() {
        this.props.subscribeToNewFeed()
    }

    onLikeClick = (id) => {
        console.log("likePost", id);
        this.props.likePost({variables: {id}})
    }

    render() {

        if (this.props.feedQuery.loading) {
            return (
                <Text> Is Loading</Text>
            )
        }
        const feeds = this.props.feedQuery.feed.map(elt => ({
            key: elt.id,
            ...elt
        }))

        return (
            <View
                style={{
                    marginTop: 50,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>this is the feeds page</Text>
                <FlatList
                    style={{marginTop: 50}}
                    data={feeds}
                    renderItem={({item}) => (
                        <Post post={item} onLikeClick={this.onLikeClick.bind(this)}/>
                    )}
                />
                <Button style={{maringTop: 10}} title="refresh"
                        onPress={() => this.props.history.push('/feed')}/>
                <Button style={{maringTop: 10}} title="log out"
                        onPress={() => this.props.history.push('/signup')}/>
                <Button style={{maringTop: 10}} title="new Post"
                        onPress={() => this.props.history.push('/newPost')}/>
            </View>
        )
    }
}

const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            id
            text
            title
            likes{
                name
            }
            author {
                name
            }
        }
    }
`
const FEED_SUBSCRIPTION = gql`
    subscription FeedSubscription {
        feedSubscription {
            node {
                id
                text
                title
                likes{
                    name
                    email
                }
                author {
                    name
                }
            }
        }
    }
`

const LIKE_MUTATION = gql`
    mutation like($id: ID!) {
        like(id: $id){
            id
        }
    }
`

export default compose(
    graphql(
        FEED_QUERY,
        {
            name: 'feedQuery', // name of the injected prop: this.props.feedQuery...
            options: {
                fetchPolicy: 'network-only',
            },
            props: props =>
                Object.assign({}, props, {
                    subscribeToNewFeed: params => {
                        return props.feedQuery.subscribeToMore({
                            document: FEED_SUBSCRIPTION,
                            updateQuery: (prev, {subscriptionData}) => {
                                if (!subscriptionData.data) {
                                    return prev
                                }
                                const newPost = subscriptionData.data.feedSubscription.node
                                if (prev.feed.find(post => post.id === newPost.id)) {
                                    return prev
                                }
                                console.log(newPost);
                                return Object.assign({}, prev, {
                                    feed: [...prev.feed, newPost],
                                })
                            },
                        })
                    },
                }),
        }),
    graphql(LIKE_MUTATION, {name: 'likePost'}))
(Feed)
