const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeDatabase = async () => {
    await mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected to Database.")
    })
    .catch((error) => console.log("Error connecting to Database."))
}

module.exports = { initializeDatabase }

// issue faced while running the code
// the dunction autocorrect has written soo many auto suggested words in function itself