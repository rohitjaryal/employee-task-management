## Where to find screenshots
screenshots/

## How to setup the application

In services:

1. Run `node generatePublicNPrivateKeys.js` This will generate public and private keys required for JSON token
2. Setup env file with two values FIREBASE_SECRET_ACCOUNT_FILE which is name of json file and 'BASE_FROM_NUMBER' which is Twilio registered number.




## How to run the application

This is mono repo and contain both server and client code. Go to root folder and run following commands

Webapp:

`npm i install-app`

`npm run start-app`

Server: 

`npm i install-services`

`npm run start-services`


## List of improvements
1. Chat messaging
2. Employee id shouldn't be cryptic.
3. Transaction control in updating firebase.
4. Better abstraction in Routes >controller > services > model > firebase.
5. Better exception handling and sending server codes to client.
6. On web app, protect routes for admin/employees.
7. Currently, no notifications on success/error on webapp