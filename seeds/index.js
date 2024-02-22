const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
// mongoose.connect('mongodb+srv://luckyvarshith24:21Epnx8vum1GIyFR@cluster.kc4rv28.mongodb.net/');

const db = mongoose. connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae molestias exercitationem magni sit, dolorum suscipit quos eligendi vero dolorem, neque similique amet! Delectus numquam quibusdam quis ipsum. Labore, fuga qui!",
            price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})