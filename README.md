# NodeJS Shared Workspace  
## Welcome  
You are running an instance of the [Node](https://nodejs.org) workspace on [ixdcoder.com](https://ixdcoder.com), the Coder environment for IXD students at Sheridan College. Each instance of the Node workspace is precongifured with boilerplate project code. By default we include a simple NodeJS 'Hello World' app using an [Express](https://expressjs.com) Server. You are encouraged to adapt it for your own use case. 
## Editor
The online editor is a [browser-based version of VSCode](https://github.com/coder/code-server). Your workspace will keep running even if you close this window. You may share access to this editor (see the Share options below) but a Sheridan login is required.
## Workspace 
The Coder Workspace page ([https://ixdcoder.com/@daole/Project2-ArtBoard](https://ixdcoder.com/@daole/Project2-ArtBoard)) gives you settings and workflow options. You can also setup a schedule for the workspace (e.g. run continuously or go to sleep after a while). Be sure to check out all the options on the [workspace page](https://ixdcoder.com/@daole/Project2-ArtBoard) under **Settings** > **Workspace Schedule** > **Autostop**.
## Publishing
Assuming you are running a server (e.g. the NodeJS boilerplate example), your project will be reachable at the following Public URL:
[https://public--main--project2-artboard--daole.ixdcoder.com/](https://public--main--project2-artboard--daole.ixdcoder.com/). You can share this with anyone who wants to see your work. 
## Shortcuts
On the bottom left toolbar, you will find some useful shortcuts:
- 🟢 Server Status: Indicates whether NodeJS is running or not. Technically, whether the server port 8000 is currently in use. 
- ▶ Start: Runs **npm run start** to launch the app. Assumes the presence of a start script in **/package.json**.
- ■ Stop: Stop the app from running. (i.e. Close all processes that are using the server port 8000 and reset all terminal windows).
- 🌐 Share: Opens a panel to give you options for sharing access to your project. 
- 📂 Zip: Shortcut to automatically create a ZIP Archive of the Project and download it. 
- 🖥️ Terminal: Opens the Terminal window if it is not already open. 
## Environment Variables and Secrets
The start script for NodeJS has been configured to load environment variables from the `.env` file in the root of your project. You can reference your secrets in JavaScript using the notation `process.env.MY_SECRET`, or if you prefer, `process.env['MY_SECRET']`. Read about [best practices](https://12factor.net/config) if you like. Note that if you are uploading your code to GitHub, the `.env` file will be ignored for security reasons, as per the settings in `.gitignore`. Do not share your passwords, API Keys, and Secrets publicly.
## Network Ports
This environment assumes that you will use port 8000 in your app, as is done in the hello world example. The **PORT** environment variable has been pre-configured for this purpose. You can refer to this variable in JavaScript using **process.env.PORT**.
## IXD Tools
This workspace includes some extra buttons and features that have been added via a custom VSCode extension [IXD Tools](https://bender.sheridanc.on.ca/sikkemha/ixd-tools) created by [Harold Sikkema](https://nsitu.ca). If you have questions or concerns about this extension please contact [harold.sikkema@sheridancollege.ca](harold.sikkema@sheridancollege.ca)  
## Technical Note
In order to keep the workspace tidy, VSCode has been configured to hide a number of system files from the File Explorer. To see a full index of the home directory, open the terminal and run `ls -la`. To customize VSCode manually, you can also run `code-server ~/.local/share/code-server/User/settings.json` in the terminal. 
