const { gql } = require('apollo-server');


const typeDefs = gql`

"A blog written by a user"
    type Blog {
        blogID: ID!
        title: String!
        body: String!
        author: Author!
        comments: [Comment]
        likes: Int
        unlikes: Int
    }

    type Author {
        authorName: String!
        authorEmail: String
    }

    type Comment {
        commentID: ID!
        comment: String
        author: Author
    }

type Query {
    blogs: [Blog!]!,
}


type Mutation {

    "Creat blogs"
    
    addBlog(title: String!, body: String!, authorName: String!, authorEmail: String!) : Blog,

    "Update blogs"
    updateBlog(blogID: ID!, title: String, body: String) : Blog,

    "Delete blog"

    deleteBlog(blogID: ID!) : String,

    "Like a Blog"
    likeBlog(blogID: ID!) : Blog,

    "Unlike a blog"
    unlikeBlog(blogID: ID!) : Blog,

    "add comments to blogs"
    addComment(blogID:ID!, comment: String!, authorName : String!, authorEmail: String!) : Blog,

    "delete comment"
    deleteComment(commentID: ID!) : String,

}


`;



module.exports = typeDefs;