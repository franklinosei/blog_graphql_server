const { ApolloServer, gql } = require('apollo-server');
const { MongoClient } = require("mongodb");
const env = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


const uri = process.env.DATABASE_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const resolvers = {
    Query: {

        blogs: (parent, args, context, info) => {
            client.connect()
            const collection = client.db("BlogDB").collection("blogs");
            results = collection.find({}).toArray()
            return results
        }
    },

    
    Mutation: {

        //resolver for creating new blogs
        addBlog(parent, args, context, info) {
            const { title, body, authorName, authorEmail } = args

            // generates a unique id for each blog created
            uid = uuidv4()

            // new blog object to be saved in database
            const newBlog = {
                blogID: uid,
                title,
                body,
                author: {
                    authorName,
                    authorEmail
                },
                likes: 0,
                unlikes: 0,
                comments: []
            }

            //connect to database
            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            //insert new blog into database
            collection.insertOne(newBlog)

            return newBlog


        },

        //handles the update of blogs
        updateBlog(parent, args, context, info) {

            const { blogID, title, body } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            //filter to get blog using the blogID from database
            filter = { blogID: blogID }

            //checking of any if the fields is not undefined before commiting to database
            if (title !== undefined) {
                const updateDoc = {
                    $set: {
                        title: title
                    },
                };
                results = collection.updateOne(filter, updateDoc)
            }

            if (body !== undefined) {
                const updateDoc = {
                    $set: {
                        body: body
                    },
                };
                results = collection.updateOne(filter, updateDoc)
            }
            return collection.findOne({ blogID: blogID })
        },


        // handles blog deletion
        deleteBlog(parents, args, context, info) {
            const { blogID } = args
            const doc = {
                blogID: blogID
            }
            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            try {
                deleteResults = collection.deleteOne(doc)
                return "Blog deleted successfully"
            } catch (e) {
                return `Something went wrong, error ${e}`
            }

        },

        //increases the like of blog
        likeBlog(parent, args, context, info) {
            const { blogID } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            filter = { blogID: blogID }

            const updateDoc = {
                $inc: {
                    likes: 1
                },
            };
            results = collection.updateOne(filter, updateDoc)
            return collection.findOne(filter)
        },

        // unlike blogs i.e increase blog's unlike
        unlikeBlog(parent, args, context, info) {
            const { blogID } = args
            client.connect()
            const collection = client.db("BlogDB").collection("blogs");
            filter = { blogID: blogID }
            const updateDoc = {
                $inc: {
                    unlikes: 1
                },
            };
            results = collection.updateOne(filter, updateDoc)
            return collection.findOne(filter)
        },

        //appends new comments to comments array of blog
        addComment(parent, args, context, info) {
            const { blogID, comment, authorName, authorEmail } = args
            client.connect()
            const collection = client.db("BlogDB").collection("blogs");
            filter = { blogID: blogID }

            //generates random unique for ever new comment. This helps when we want to find a particular comment
            uid = uuidv4();

            //a comment object
            commentObj = {
                commentID: uid,
                comment: comment,
                author: {
                    authorName,
                    authorEmail
                }
            }

            //query object
            const updateDoc = {
                $push: {
                    comments: {
                        $each: [commentObj]
                    }
                },
            };

            //find and appent to comment list
            results = collection.updateOne(filter, updateDoc)

            //return new blog data
            return collection.findOne(filter)


        },

        //handles deletion of comments
        deleteComment(parent, args, context, info) {
            const { commentID } = args
            const doc = {
                commentID: commentID
            }

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");
            try {
                deleteResults = collection.deleteOne(doc)
                return "Comment has been deleted successfully"
            } catch (e) {
                return `Something went wrong, error ${e}`
            }
        }
    }

}


module.exports = resolvers;