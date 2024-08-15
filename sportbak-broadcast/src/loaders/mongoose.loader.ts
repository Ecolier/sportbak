import dbService from '../models';

export function load(){
    dbService.mongoose
    .connect(dbService.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify : false,
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });
    dbService.mongoose.set('useCreateIndex', true);
}