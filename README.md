# Image Gallery

---
## Requirements

For development you will only need Node.js and npm installed in your environment.

### Node
- #### Node installation on Windows

  Just go to the [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


---

## Install

    $ git clone https://github.com/borisstojanovic/ReactImageGallery
    $ cd ReactImageGallery/node
    $ npm install
    $ cd ..
    $ cd react-app
    $ npm install

## Configuring the node app

Open `utils/database.js` then edit it with your settings. You will need:

- user;
- password;
- host;
- database;

Open `utils/cloudinary.js` then edit it with your settings. You will need:

- cloud_name;
- api_key;
- api_secret;

In order to get these settings you will have to create a [cloudinary](www.cloudinary.com) account

## Running the node project
  
    $ cd node
    $ node app.js

## Running the react app

    $ cd react-app
    $ npm start