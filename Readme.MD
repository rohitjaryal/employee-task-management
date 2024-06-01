## Where to find screenshots
screenshots/

## How to setup the application

In services:

1. Run `node generatePublicNPrivateKeys.js` This will generate public and private keys required for JSON token
2. Setup .env file with these values 
     -FIREBASE_SECRET_ACCOUNT_FILE=
     -BASE_FROM_NUMBER=
     -TWILIO_ACCOUNT_SID=
     -TWILIO_AUTH_TOKEN=
     -template_id= // from send grid
     -fromEmail=




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


![Alt text](screenshots/admin_login.png?raw=true "Login")
![Alt text](screenshots/verify_by_email_link.png?raw=true "Verify and onboard employee")
![Alt text](screenshots/manage_employee.png?raw=true "Manage employee")
![Alt text](screenshots/chat_conversation.png?raw=true "Chat conversation")