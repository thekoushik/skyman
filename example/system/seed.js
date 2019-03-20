const config=global.config = require('../config').development;
var {seeder,connect} = require('../database');

if(process.argv.length<3)
    console.log(`Seed:
npm run seed <seeder_name1> [<seeder_name2>] ..

Available Seeders:
${seeder.seeder_names}`);
else{
    connect(true).then(()=>seeder.seed(process.argv.slice(2)));
}