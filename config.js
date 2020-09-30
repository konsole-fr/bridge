#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');

if (fs.existsSync('.credentials.json')) {
  console.log('You have already configured the bridge. Run it using the following command: konsole');
  process.exit(0);
}

inquirer.prompt([
  { name: 'hostname', message: 'What is the hostname?' },
  { name: 'username', message: 'What is your database username?' },
  { name: 'password', message: 'What is your database password?' },
  { name: 'database', message: 'What is the database?' },
  { name: 'token',     message: 'What is your Konsole.fr token?' },
]).then(answers => {
  const { hostname, username, password, database, token } = answers;
  const url = `postgres://${username}:${password}@${hostname}/${database}`;
  const data = { url, token };
  fs.writeFile('.credentials.json', JSON.stringify(data), (err) => {
    if (err) console.log(err);
    console.log('Database credentials are now stored on your server. You can now start the server by typing the following command: konsole'); 
  });
}).catch(err => {
  console.log(err);
});
