const {MongoClient} = require('mongodb');

const URI = "";

let client;
let db;

async function connectToDatabase(URI) {
    if (!client) {
        client = new MongoClient(URI);
        await client.connect();
        console.log('Connected to database');
        db = client.db("mealtimes");
    }
    return db;
}


const updateTime = async (db,name,time) =>
    {      
        db = await connectToDatabase(URI);
        
        try{
            const collection = db.collection('breakfast');
            const currTime = new Date();

            const filter = {"name" : name};
            const update = {$set: {
                "openingTime" : currTime
            }};

            const result = await collection.updateOne(filter,update)
            console.log(result)
        }
        catch(err){
            console.error(err)
        }
        
    }

updateTime(db,"Idli","closingTime");