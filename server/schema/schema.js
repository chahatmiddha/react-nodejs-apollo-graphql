const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull } = graphql;

const Post = require('../models/post');
const User = require('../models/user');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        is_read: { type: GraphQLInt },
        date: { type: GraphQLString },
        user: { 
            type: UserType,
            resolve(parent, args){
                //return users[parent.userId]
                //console.log(parent.userId);
                return User.findOne({id: parent.userId})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        post: {
            type: PostType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                //return posts[args.id]
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                //return posts
                let perPage = 10;
                let page = 0;
                return Post.find({})
                //.limit(perPage)
                //.skip(perPage * page)
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                //return users[args.id]
                return User.findById(args.id)
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPost: {
            type: PostType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                body: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLInt) },
                is_read: { type: new GraphQLNonNull(GraphQLInt) },
                date: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args){
                let lastPost = await Post.find({id: {$exists: true}}).sort({id: -1}).limit(1); 
                let _id = 1;
                // This always returns an array, either empty or with data
                if(Array.isArray(lastPost) && lastPost.length > 0){
                    lastPost = lastPost[0]
                    _id = lastPost['id'] + 1;
                }
                
                let post = new Post({
                    id: _id,
                    title: args.title,
                    body: args.body,
                    userId: args.userId,
                    is_read: args.is_read,
                    date: args.date
                })
                return post.save()
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                is_read: { type: new GraphQLNonNull(GraphQLInt) },
            },
            async resolve(parent, args){
                return await Post.findOneAndUpdate(
                    {"id": args.id},
                    { "$set":{is_read: args.is_read}},
                    {"new": true} //returns new document
                )
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args){
                let lastUser = await User.find({id: {$exists: true}}).sort({id: -1}).limit(1); 
                let _id = 1;
                // This always returns an array, either empty or with data
                if(Array.isArray(lastUser) && lastUser.length > 0){
                    lastUser = lastUser[0]
                    _id = lastUser['id'] + 1;
                }
                let user = new User({
                    id: _id,
                    name: args.name
                })
                return user.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
