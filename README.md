- Current Machine Node Version = v22.9.0
- Current Machine npm Version = 10.8.1 
 
 - Our backend dependencies are:
    - Adm-Zip Version 0.5.16 (Helps process zip files we retrieve from the SEC API)
    - Axios Version 1.7.7 (Better version of fetch that autmatically parses jsonfiles for us and simplifies a whole bunch of other things to do with fetching)
    - Express Version 4.21.0 (The minimal and flexible web framework we use for node js to simplify building our app. It handles routing, middleware, etc)
    - Node fetch Version 3.3.2 (Fetch is not available natively so had to be installed, kinda useless since we have axios but havnt finished changing all fetches -> axios)
    - postgres Version 8.13.0 (Allows us to connect to our postgres database, execute SQL queries, handle results etc)
    - unzipper

 - Our Frontend dependencies are:
    - React Version 18.3.1 (Our framework we use to help us develop our front end)
    - React-DOM Version 18.3.1 (Reacts representation of the DOM)
    - React-Router-DOM Version 6.26.2 (Used for navigating between components / "pages")

 - Our project uses node js with express to manage the backend, react with vite for the front end, and postgres for the database.
 - Vite is responsible for compiling all the react .jsx files, html files, and css files to be served by the backend folder to the web,
 - Note that currently they are compiled into ./FrontEnd/dist
 - When you pull the files from github, everything should be fine but you may have to setup vite and node.

 - For setting up node just open up a terminal to the FrontEnd folder and another to the Backend folder and run npm init -y.
 - If the dependencies listed above are not found each's package.file then be sure to install those to the appropraite directories as well.

 - To setup vite to build the frontend / compile it, follow these following steps.
 - Also note that this should be done before you pull the data from the github.
    - You can do it after but its easier to remove the default content it creates when you set up vite first.
 1. Open a terminal to the FrontEnd folder
 2. node init -y
 3. npm install vite
 4. npm install
 5. npm run build
    - With the vite.config.js from the git, it should build all the files into ./FrontEnd/dist to be served by the backend
    - Note that every time you make changes to the front end, you need to recompile and refresh the web browser to get re-served the content
    - You do not need to restart the backend server
    - npm run dev runs the development build which can help you visualize changes in real time but you dont get the backend serving you data so 
    better to just recompile each time you make changes with npm run build and refresh


Less Important Notes.
- The LearningInstruments folder is just tools we use to experiment with and learn new things.