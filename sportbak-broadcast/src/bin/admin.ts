'use strict';

// Add context in req
declare global {
    namespace Express {
      interface Request {
        clientIp : string,
        fromLocalhost : boolean
      }
    }
}

import 'reflect-metadata';

import Container from 'typedi';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import dbService from '../models';

import AdminService from '../services/admin.service';

yargs(hideBin(process.argv))
  .command('create', 'Create admin', () => {}, async (argv) => {
    try {
        await dbService.mongoose
            .connect(dbService.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
        
        console.log("Connected to the database ! ");
        const admin = await Container.get(AdminService).create();
        if (admin){
            console.log(admin);
        }

    } catch(err){
            console.log("Cannot connect to the database!", err);
    }
    process.exit();

  })
  .command('delete <id>', 'Delete admin id', () => {}, async (argv) => {
    try {
        await dbService.mongoose
            .connect(dbService.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
        
        console.log("Connected to the database!");
        try {
            const admin = await Container.get(AdminService).remove(argv.id.toString());
            if (!admin){
                console.log("Admin not found id : " + argv.id);
            }else{
                console.log("Admin sucessfully deleted");
            }
        }catch(err){
            console.log(err);
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                console.log("Admin not found id : " + argv.id);
            } else {
                console.log("Can't delete admin : " + argv.id);
            }
        }
    } catch(err){
            console.log("Cannot connect to the database!", err);
    }
    process.exit();

  })
  .command('list', 'List admin id', () => {}, async(argv) => {
    try {
        await dbService.mongoose
            .connect(dbService.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
        
        console.log("Connected to the database!");
        try{
            const admins = await Container.get(AdminService).list();
            if (admins){
                console.log(admins);
            }
        } catch (err){
            console.log("Error when retrieving admins");
        }
    } catch(err){
            console.log("Cannot connect to the database!", err);
    }
    process.exit();
  })  
  .demandCommand(1)
  .argv

