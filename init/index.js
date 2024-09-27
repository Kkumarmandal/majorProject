const mongoose = require ("mongoose");
const initData = require ("./data.js");
const Listing = require ("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()

.then(() => {
    console.log ("Connected to DB");
})
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);  
}

const initDB = async () => {
    await Listing.deleteMany ({});
    //owner property ko add kar dete hai
    initData.data = initData.data.map((obj) => ({ 
        ...obj,
        owner: '66e958f0ff98fa65fcc49dba',
    }));

    await Listing.insertMany (initData.data);
    console.log ("Data was initialized");
};

initDB();
