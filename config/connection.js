// Connect to SQLite
const sqlite3 = require("sqlite3").verbose();

// const db = new sq...

// db.serialiye db.something
/**  const connection = {
  db: db,
  sqlcreat1:...,
}*/
const db = new sqlite3.Database('./data/db.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to database..");

});
//enable foreign keys
db.get("PRAGMA foreign_keys = ON");



/**  Table creation */
//queries to create the tables if they do not exist yet: PET, ARTICLE, PET_CATEGORY, USER, FAVOURITE, ARTICLE_CATEGORY, ADOPTION, PET_GALERY, ANALYTICS
sql_create1 = 'CREATE TABLE IF NOT EXISTS pet ( ID INT UNIQUE PRIMARY KEY, ownerID INT, name TEXT, address TEXT, categoryID INT, neutered INT, age_year INT, age_month INT, short_desc TEXT, description TEXT,created_at TEXT, updated_at TEXT, profile_img_url TEXT, FOREIGN KEY(ownerID) REFERENCES user(ID), FOREIGN KEY(categoryID) REFERENCES pet_category(ID));';
sql_create2 = 'CREATE TABLE IF NOT EXISTS article (ID INT UNIQUE PRIMARY KEY, name TEXT, author TEXT, short_desc TEXT, description TEXT, userID INT, created_at TEXT, updated_at TEXT, categoryID INT,profile_img_url TEXT, FOREIGN KEY(userID) REFERENCES user(ID), FOREIGN KEY(categoryID) REFERENCES article_cat(ID));';
sql_create3 = 'CREATE TABLE IF NOT EXISTS pet_category ( ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT );';
sql_create4 = 'CREATE TABLE IF NOT EXISTS user ( ID INT UNIQUE PRIMARY KEY, name TEXT, email TEXT UNIQUE, phone TEXT, address TEXT, role TEXT, profile_img_url TEXT);';
sql_create5 = 'CREATE TABLE IF NOT EXISTS favourite ( ID INT UNIQUE PRIMARY KEY, userID INT, petID INT, FOREIGN KEY(userID) REFERENCES user(ID), FOREIGN KEY(petID) REFERENCES pet(ID));';
sql_create6 = 'CREATE TABLE IF NOT EXISTS article_cat ( ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT );';
sql_create7 = 'CREATE TABLE IF NOT EXISTS adoption ( ID INT UNIQUE PRIMARY KEY, userID INT, petID INT, description TEXT, status TEXT, created_at TEXT, updated_at TEXT, FOREIGN KEY(userID) REFERENCES user(ID), FOREIGN KEY(petID) REFERENCES pet(ID) );';
//const sql_create8 = 'CREATE TABLE IF NOT EXISTS pet_galery ( ID INT, title TEXT, url TEXT );';
sql_create9 = 'CREATE TABLE IF NOT EXISTS analytics ( ID INT UNIQUE PRIMARY KEY, url TEXT, userID INT, pageID INT, time INT, created_at TEXT );';

//run them to create the tables on first use.
db.serialize(function() {
  //Create queries
  db.run(sql_create4, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("User table: check.");
  });

  db.run(sql_create3, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Pet_category table: check.");
  });

db.run(sql_create1, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Pet table: check.");
});

db.run(sql_create6, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Article_category table: check.");
});

db.run(sql_create2, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Article table: check.");
});

db.run(sql_create5, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Favourite table: check.");
});

db.run(sql_create7, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Adoption table: check.");
});


/*db.run(sql_create8, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Pet_galery table: check.");
});*/

db.run(sql_create9, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Analytics table: check.");
});

})

const connection = {
  db: db,
  initialInsert: function(){
        console.log('connection.initialInsert')
        /**  Initial Insertion */
        sql_inserts=[];
        //Users, 
        // WHERE NOT EXISTS (SELECT * FROM user)
        // ID,name TEXT, email TEXT UNIQUE, phone TEXT, address TEXT, role TEXT, profile_img_url TEXT
        var imgurl = "/images/repo/user.png";
        sql_inserts.push('INSERT INTO user VALUES (1, "Grese Hyseni", "hysenigresa@gmail.com", "067239232", "Spengergasse", "Admin", "'+imgurl+'") ; ');
        sql_inserts.push('INSERT INTO user VALUES (2, "Hannah Poor", "hannahpoor@gmail.com", "067239232", "Maria Hilf.", "Admin", "'+imgurl+'") ; ');
        sql_inserts.push('INSERT INTO user VALUES (3, "User 3", "user3gmail.com", "067239232", "Address", "General", "'+imgurl+'") ; ');
        sql_inserts.push('INSERT INTO user VALUES (4, "User 4", "user4gmail.com", "067239232", "Address", "General", "'+imgurl+'") ; ');


        // Article Categories
        //ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT 
        sql_inserts.push('INSERT INTO article_cat VALUES (1,"General", "Category Description") ; ');
        sql_inserts.push('INSERT INTO article_cat VALUES (2,"Food", "Category Description") ; ');
        sql_inserts.push('INSERT INTO article_cat VALUES (3,"Adoption", "Category Description") ; ');
        sql_inserts.push('INSERT INTO article_cat VALUES (4,"Donations", "Category Description") ; ');


        //Articles
        //ID,name TEXT, author TEXT, short_desc TEXT, description TEXT, userID INT, created_at TEXT, updated_at TEXT, article_catID INT
        var short_desc1 = "Having a pet sounds interesting and fun. But, adopting a pet and taking care of them is a big responsibility. Here are some of the tips which will help you to take good care of your pet and keep them happy, active and healthy:";
        var desc1 = "- Feed your pet a good and high-quality foods\n"+
                  "- Take them for a walk every day for at least half an hour\n"+
                  "- Provide them with the needed vaccination on time\n"+
                  "- Keep a clean and hygienic environment for them\n"+           
                  "- Visit Vet on a weekly/monthly basis\n"+           
                  "- Engage and do not leave them alone for a long time\n"+           
                  "- Provide them with a good and comfortable shelter\n"+           
                  "- Keep them away from dust and allergies\n"+           
                  "- Love them unconditionally, treat them like your family, talk to them";

        var imgurl = '/images/repo/petcare-large.jpg';
        var imgurl1 = '/images/repo/mia_maya.jpg';
        var short_desc2 = "Two of the most popular pets are dogs and cats; the technical term for a cat lover is an ailurophile and a dog lover a cynophile.";
        var desc2 = "Other animals commonly kept include: rabbits; ferrets; pigs; rodents, such as gerbils, hamsters, chinchillas, rats, mice, and guinea pigs; avian pets, such as parrots, passerines and fowls; reptile pets, such as turtles, alligators, crocodiles, lizards, and snakes; aquatic pets, such as fish, freshwater and saltwater snails, amphibians like frogs and salamanders; and arthropod pets, such as tarantulas and hermit crabs. Small pets may be grouped together as pocket pets, while the equine and bovine group include the largest companion animals.";
        sql_inserts.push('INSERT INTO article VALUES (1, "How to take care of your pet?", "Grese Hyseni", "'+desc1+'","'+short_desc1+'", 1, "01/11/2021", "01/11/2021", 1, "'+imgurl+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (2, "Know more about pets", "Grese Hyseni", "'+desc2+'","'+short_desc2+'", 1, "01/11/2021", "01/11/2021", 1, "'+imgurl1+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (3, "How to take care of your cat?", "Hannah Poor", "'+desc1+'","'+short_desc1+'", 1, "01/11/2021", "01/11/2021", 2, "'+imgurl+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (4, "Know more about pets", "Hannah Poor", "'+desc2+'","'+short_desc2+'", 2, "01/11/2021", "01/11/2021", 3, "'+imgurl1+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (5, "Article Title", "Author Name", "'+desc1+'","'+short_desc1+'", 2, "01/11/2021", "01/11/2021", 1, "'+imgurl+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (6, "Article Title", "Author Name", "'+desc2+'","'+short_desc2+'", 2, "01/11/2021", "01/11/2021", 2, "'+imgurl1+'"); ');
        sql_inserts.push('INSERT INTO article VALUES (7, "Article Title", "Author Name", "'+desc1+'","'+short_desc1+'", 1, "01/11/2021", "01/11/2021", 1, "'+imgurl+'"); ');


        // Pet Categories
        //ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT 
        sql_inserts.push('INSERT INTO pet_category VALUES (1,"Cats", "Category Description") ; ');
        sql_inserts.push('INSERT INTO pet_category VALUES (2,"Dogs", "Category Description") ; ');
        sql_inserts.push('INSERT INTO pet_category VALUES (3,"Rabits", "Category Description") ; ');


        // Pets
        //ID , ownerID INT, name TEXT, address TEXT, categoryID INT, neutered INT, age_year INT, age_month INT, short_desc TEXT, description TEXT, profile_img_url 
        var desc = " is an adorable black and white kitten. In addition to his beautiful coat, he sports a small black mark right under his nose that almost looks like a mustache. Milkshake is very playful and loves to purr. He likes to climb just about anything, from chairs to the family Christmas tree. You will find Milkshake spending plenty of time with his brother Stampy. Milkshake is also great around adult cats. Milkshake seems to be okay around younger children, but can be a bit shy at first as well as around new people. He likes to be held and is more than happy finding a cozy spot on your lap before bedtime. He is also very independent and loves to be active and curiously explore on his own."
        sql_inserts.push('INSERT INTO pet VALUES (1, 1, "Dobby", "Vienna", 1, 1, 0,5, "Meet Dobby! ", "Dobby '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/dobby2.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (2, 2, "Mia and Maya", "Vienna", 1, 1, 0,5, "Meet Mia and Mia! They are unseparable!", "Mia and Mia '+ desc+'", "01/11/2021", "01/11/2021", "01/11/2021", "01/11/2021","/images/repo/mia_maya.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (3, 1, "Roko", "Vienna", 1, 1, 0,5, "Meet Roko!", "Roko '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/roko.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (4, 2, "Ron", "Vienna", 2, 1, 0,5, "Meet Ron!", "Ron '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/ronald2.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (5, 3, "Harry", "Vienna", 2, 1, 0,5, "Meet Harry!", "Harry '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/harry2.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (6, 3, "Hermione", "Vienna", 2, 1, 0,5, "Meet Hermione!", "Hermione '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/hermione2.jpg")  ; ');
        sql_inserts.push('INSERT INTO pet VALUES (7, 3, "Luna", "Vienna", 3, 1, 0,5, "Meet Luna!", "Luna '+ desc+'", "01/11/2021", "01/11/2021","/images/repo/pawprint-blue.png")  ; ');


        // Adoption
        // ID, userID INT, petID INT, description TEXT, status 
        sql_inserts.push('INSERT INTO adoption VALUES (1, 1, 1, "Description", "Approved","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (2, 2, 2, "Description", "In Progress","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (3, 2, 3, "Description", "Approved","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (4, 3, 4, "Description", "Initiated","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (5, 3, 5, "Description", "Declined","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (7, 3, 5, "Description", "Initiated","01/11/2021", "01/11/2021") ; ');
        
        sql_inserts.push('INSERT INTO adoption VALUES (8, 4, 1, "Description", "Approved","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (9, 4, 2, "Description", "In Progress","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (10, 4, 3, "Description", "Approved","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (11, 5, 4, "Description", "Initiated") ; ',"01/11/2021", "01/11/2021");
        sql_inserts.push('INSERT INTO adoption VALUES (12, 5, 5, "Description", "Declined","01/11/2021", "01/11/2021") ; ');
        sql_inserts.push('INSERT INTO adoption VALUES (13, 6, 5, "Description", "Approved","01/11/2021", "01/11/2021") ; ');

        // Favourite
        //ID,userID INT, petID INT,
        sql_inserts.push('INSERT INTO favourite VALUES (1,1,1) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (2,2,1) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (3,3,2) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (4,4,2) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (5,1,3) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (6,2,3) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (7,3,4) ; ');
        sql_inserts.push('INSERT INTO favourite VALUES (8,4,4) ; ');

        // SQL inserts
        db.serialize(function() {
          sql_inserts.forEach(element => {
            db.run(element, err => {
              if (err) {
                console.log(err)
                return console.error(err.message);
              }      
              console.log("Table inserted!");
            });
          });
        });
  }
}

module.exports = connection;

