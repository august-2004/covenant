const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://srinidhi:sri2004@srinidhicluster.fupcmdo.mongodb.net/passport?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas - Database: passport'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;