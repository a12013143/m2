const mongoose = require("mongoose");

const mongoMigrate = {

    openMongoDb: function(mongoUrl) {
        return new Promise( (resolve, reject) => {
            mongoose.connect(mongoUrl, (err, mongodb) => {
                if(err) {
                    reject(err);
                }
                else {
                    this.mongodb = mongoose.connection;
                    resolve();
                }
            });
        });
    },
    /* Insertion */
    insertIntoCollection: function(domArray,collectionName) {
        return new Promise( async (resolve, reject) => {
            try {
                // let result = await this.mongodb.collection(collectionName).insertMany(domArray);                
                let result = await mongoose.model(collectionName).insertMany(domArray);
                resolve({
                    code : 200,
                    message : "success"
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }

}

module.exports = mongoMigrate;