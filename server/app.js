const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
var cors = require('cors');

const app = express();

// cors
app.use(cors());
// mongodb connection
mongoose.connect('mongodb+srv://chahatm:test123@cluster0.yyc7v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser:true
});
mongoose.connection.once('open', () => {
    console.log('mongo db connect');
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path
    }),
}));

app.listen(4000, () => {
    console.log('graphql running on 4000');
})
