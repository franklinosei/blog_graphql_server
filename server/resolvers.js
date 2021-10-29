const { ApolloServer, gql } = require('apollo-server');
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require('uuid');


const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const resolvers = {
    Query: {
        blogs: (parent, args, context, info) => {



            client.connect()

            const collection = client.db("BlogDB").collection("blogs");

            results = collection.find({}).toArray()

            // client.close();

            return results

            // perform actions on the collection object



        }
    },

    Mutation: {

        addBlog(parent, args, context, info) {

            const { title, body, authorName, authorEmail } = args

            uid = uuidv4()

            const blogObj = {
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

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            collection.insertOne(blogObj)

            return blogObj


        },

        updateBlog(parent, args, context, info) {

            const { blogID, title, body } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            filter = { blogID: blogID }

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

        likeBlog(parent, args, context, info) {
            const { blogID } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            filter = { blogID: blogID }

            // temp = collection.findOne(filter)


            const updateDoc = {
                $inc: {
                    likes: 1
                },
            };


            results = collection.updateOne(filter, updateDoc)


            return collection.findOne(filter)



        },

        unlikeBlog(parent, args, context, info) {

            const { blogID } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            filter = { blogID: blogID }

            // temp = collection.findOne(filter)


            const updateDoc = {
                $inc: {
                    unlikes: 1
                },
            };


            results = collection.updateOne(filter, updateDoc)


            return collection.findOne(filter)


        },

        addComment(parent, args, context, info) {

            const { blogID, comment, authorName, authorEmail } = args

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");

            filter = { blogID: blogID }

            uid = uuidv4();

            commentObj = {
                commentID: uid,
                comment: comment,
                author: {
                    authorName,
                    authorEmail
                }
            }


            const updateDoc = {
                $push: {
                    comments: {
                        $each: [commentObj]
                    }
                },
            };


            results = collection.updateOne(filter, updateDoc)


            return collection.findOne(filter)


        },

        deleteComment(parent, args, context, info) {
            const { commentID } = args

            const doc = {
                commentID: commentID
            }

            client.connect()
            const collection = client.db("BlogDB").collection("blogs");
            try {
                deleteResults = collection.deleteOne(doc)
                return "Comment deleted successfully"
            } catch (e) {
                return `Something went wrong, error ${e}`
            }
        }



    }


}


module.exports = resolvers;