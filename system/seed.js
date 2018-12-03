var {seed,seeder_names} = require('../seeders');

if(process.argv.length<3)
    console.log(`Seed:
npm run seed <seeder_name1> [<seeder_name2>] ..

Available Seeders:
${seeder_names}`);
else{
    const config = require('../config').development;
    var mongoose = require('mongoose');
    mongoose.Promise=global.Promise;
    mongoose.connect(config.mongoURI,{ useMongoClient: true}).then(()=>{
        seed(process.argv.slice(2));
    })
}