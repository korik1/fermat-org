![alt text](https://github.com/bitDubai/media-kit/blob/master/MediaKit/Fermat%20Branding/Fermat%20Logotype/Fermat_Logo_3D.png "Fermat Logo")

# fermat-org server

## Installation Guide

###Manually installing Node.js

* Go to the [official website](https://nodejs.org/en/) and download the version for linux.

* Unzip the downloaded file in the folder of your choice.

* Please go to your home folder and press CTRL + H to see hidden files.

* Locate the .bashrc file and double-click on it.

* Add the environment variables NODEJS_HOME to file .bashrc.
	NODEJS_HOME=/URL_NODE_JS

* Add the environment variables to PATH.
	
	PATH=$PATH:$JAVA_HOME/bin:$NODEJS_HOME/bin

	If the PATH is not created then write this
	
	PATH=$PATH:$NODEJS_HOME/bin
	
	export PATH

* Save your changes.

* Close the .bashrc file and open the terminal.

* Type in the terminal the following command.

	```bash
	node --version
	```
If Node.js version shown in the terminal means that is already installed.

* Type in the terminal the following command.
	```bash
	npm --version
	```
If the version of npm shown in the terminal means that is already installed.

Node.js comes with so npm can also use the command npm.

###Installing Node.js via package manager

```bash
	sudo apt-get update
	sudo apt-get install nodejs
```

###Installing MongoDB

Open the terminal and type the command
```bash
sudo apt-get install mongodb
```

###Install and Configure RockMongo - A Tool to Manage MongoDB

**Prerequisites**
* MongoDB
* Apache Server
* PHP – 5.1.6 or newer

1) Install PHP with Apache

```bash
	sudo apt-get install php5 libapache2-mod-php5
```
2) Install PHP Pear

```bash
	sudo apt-get install php-pear
```
3) Check that the PEAR and PECL Versions

```bash
	pear version
```
```bash
	pecl version
```
4) Install package php5-dev 

```bash
	sudo apt-get install php5-dev
```
5) Install php MongoDB Driver

```bash
	sudo pecl install mongo
```
6) Download the latest Rockmongo from – http://rockmongo.com/downloads

	Extract it to /var/www/html/

7) Add Extention to php.ini

* locate php.ini (/etc/php5/apache2/php.ini).
* Add – “extension=mongo.so” to the “Dynamic Extensions” section.

8) Then Restart Apache server.
```bash
	sudo service apache2 restart
```

9) Go to – http://localhost/rockmongo-1.1.7 (Name the folder that contains the tool rockmongo which moved to the location /var/www/html)

Login with 

* Username - admin
* Password - admin 

###Installing Apidoc

apiDoc creates a documentation from API annotations in your source code.

* To install and run apidoc follow these steps:

* Open the terminal and go to the api-server project folder.

* Type the following command in the terminal.
```bash
 sudo npm install apidoc -g
```
* To generate the html pages of documentation run the following command:
```bash
 sh generate_apidoc.sh
```
The documentation is generated in the folder api-server/apidoc. For more information visit apidoc tool http://apidocjs.com/

###Running the project (api-server)

To run the project, follow these steps:

* Open the terminal and go to the api-server project folder.

* Type the following command in the terminal.
```bash
 sudo npm install
```
* Then type:
```bash
 sudo npm install forever -g
```
* Now run the command:
```bash
 sh starter.sh
```
The project should be running. a proxy on port 3000, the master branch in port 3001 and the branch Develop in port 3002.

###Running fermat.org locally

* Install apache.
	* To install apache, open terminal and type in these commands:
```bash
sudo apt-get update
```
```bash
sudo apt-get install apache2
```
* Verify that the Apache Server is working properly.
	* Open your web browser and type http://localhost/index.html.
	* If the page is visualized correctly it means that the server was successfully installed.

* Open the terminal and move to the folder platform-visualization and run gulp.

* Publish the application fermat.org on your apache server.
	* Copy the folder platform-visualization in /var/www/html.

* Finally open your Web browser and type http://localhost/platform-visualization/index.html
	* if the page does not open and you get this error in the web console THREE.WebGLRenderer: Error creating WebGL context. You must update your browser.
	* We recommend using the google chrome browser.

###Project structure

The project is structured as follows:

* **api-server** it contains the server and business logic.
	* **assets**  it contains image and css style resources for doc book.
	* **bin** server executable file.
	* **cache** where the fermat repo is saved (master and develop branches).
	* **lib** it contains libraries of our creation.
	* **modules** it contains modules folder (where main development is made).
	* **public** web access (not developed yet).
	* **routes** it contains route files.
	* **views**  it contains template files for web access.
	* **app.js [file]** it contains the main server code.
	* **config.js [file]** it contains the configuration of the connection to the database.
	* **db.js [file]** establishes the connection to the database.
	* **Gruntfile.js [file]** provides the setting for Grunt. It is responsible for verifying that the JavaScript syntax is correct.
	* **image-loader.js [file]** it contains a script used to generate a JSON object with the images that are within the repository.
	* **manual_update.js [file]** t serves to update the database manually
	* **package.json [file]** here are all the dependencies.
	* **proxy.js [file]** creates proxy servers and starts http server to redirect requests according to version.
	* **starter.sh [file]** starts the server.
	* **test.js [file]** tests are implemented here to generate documentation that is in the repository.
	* **update.js [file]** you download all the repository and updates the database.

* **p2p-network-visualization** which has all the logic that is used to plot the Fermat p2p network that includes servers, clients, each client wallets etc.

* **platform-visualization** It contains the logic that is responsible for plotting the repository Fermat.
	* **books** contains documentation of fermat in PDF format and in a normal version and BIG.
	* **common** it contains the libraries used in the project.
	* **images** it contains all the images used in the page properly sorted.
	* **node_modules** it is created by Node.js when installing gulp. (Gulp.js is a build system to automate common development tasks, such as minification of JavaScript, recharge browser, image compression, syntax validation code and a myriad of other tasks)
	* **src** it contains the source files, each representing a class and is the main viewer.js. Gulp reviews each time you change one of these files and generates the final main.js file, this is using the page.
	* **config_map.json [file]** it contains information on how they set the different views of the page (table, workflow, architecture, learn, etc.). If this file is changed the navigational structure is modified.
	* **gulpfile** it is the configuration file gulp.
	* **images.json** it contains a list of all images that are in the images folder. This is to preload all the images while the page loads, so that no black boxes or sheets without displaying images because they have not downloaded yet.
	* **package.json** it is the configuration file of Node.js and has a list of applications it (in this case only gulp)