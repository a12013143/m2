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
    insertIntoCollection: function(domArray,collectionName,callback) {

        // let result = await this.mongodb.collection(collectionName).insertMany(domArray);
                        
        mongoose.model(collectionName).insertMany(domArray,function(err,result){
            if (err) {
                console.log(err);
                return err;
              } else {
                callback(result);
              }
        });

    },
    insertIntoSubCollection: function(domArray,tableName,subCollectionName,_id,callback) {

        // let result = await this.mongodb.collection(collectionName).insertMany(domArray);
                        
        mongoose.model(tableName).updateOne({_id:_id},{[subCollectionName]:domArray},function(err,result){
            if (err) {
                console.log(err);
                return err;
              } else {
                callback(result);
              }
        });

    }

}

module.exports = mongoMigrate;