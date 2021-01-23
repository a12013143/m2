const MongoClient = require('mongodb').MongoClient;

const mongoMigrate = {

    initiate: function(mongoUrl) {
        this.mongoUrl = mongoUrl;
        this.mongoDbName = undefined;
        this.mongodb = undefined;
        this.collectionName = undefined;
    },
    openMongoDb: function() {
        return new Promise( (resolve, reject) => {
            MongoClient.connect(this.mongoUrl, (err, mongodb) => {
                if(err) {
                    reject(err);
                }
                else {
                    let dbName = this.getDbNameFromUrl();
                    this.mongodb = mongodb.db(dbName);
                    resolve();
                }
            });
        });
    },
    getDbNameFromUrl: function() {
        let mongoUrl = this.mongoUrl;
        let tokenArray = mongoUrl.split("/");
        let dbName = tokenArray[tokenArray.length - 1];
        this.mongoDbName = dbName;
        return this.mongoDbName;
    },
    
    setCollectionName: function(collectionName) {
        this.collectionName = collectionName;
        return this;
    },

    resetCollectionName: function() {
        this.collectionName = undefined;
        return this;
    },
    createCollection: function(collectionName) {
        return new Promise( (resolve, reject) => {
            try {
                this.mongodb.createCollection(collectionName, (err, res) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(collectionName);
                    }
                });
            }
            catch(err) {
                reject(err);
            }
        });
    },
    /* Insertion */
    insertIntoCollection: function(domArray) {
        return new Promise( async (resolve, reject) => {
            try {
                let collectionName = this.collectionName;
                let result = await this.mongodb.collection(collectionName).insertMany(domArray);
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