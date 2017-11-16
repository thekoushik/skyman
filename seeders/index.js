var admin_seeder=require('./admin.seeder');
const allseeders={
    'admin': admin_seeder
};
var seeder_names=exports.seeders=Object.keys(allseeders);

exports.seed=(seeders)=>{
    var seedersToSeed;
    if(!seeders)
        seedersToSeed=seeder_names;// console.log('Seed All')
    else if(Array.isArray(seeders))
        seedersToSeed=seeders; //console.log('Seed all seeders from array')
    else
        seedersToSeed=[seeders] //console.log('Seed single seeder')
    Promise.all(seedersToSeed.map(seeder=>allseeders[seeder]()))
        .then((values)=>{
            console.log("Total seed: "+values.length);
        })
}