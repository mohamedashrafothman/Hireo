# Hireo
One Paragraph of project description goes here

## Services
This application has been designed to use the free tiers of these services to get a live development environment up and running with minimal effort as a starter template. In order to deploy this application as-is, you will need accounts from these services:

* [Heroku](https://signup.heroku.com/) - hosts the application.
* [Mailtrap](https://mailtrap.io) - Mailtrap is a solution that allows testing email notifications without sending them to the real users of your application. It also lets you view all your emails online, forward them to your regular mailbox, share with the team and more!
* [mLab](https://mlab.com/signup/) - hosts the Mongo database.  This one is **optional** as you can add an mLab database directly to your Heroku instance without an mLab account. However, if you'd like to have separate databases for your local development and Heroku environments, you will need to create an mLab account.
* [Facebook Developer](https://developers.facebook.com/) - For OAuth purpose.
* [Google Developer](https://console.developers.google.com) - For OAuth purpose.
* [NodeMailer](https://nodemailer.com) - Nodemailer is a module for Node.js applications to allow easy as cake email sending.
* [Socket.IO](https://socket.io/) - Featuring the fastest and most reliable real time engine.


## Heroku Setup

* Fork this project to your own GitHub account.
* Sign up for or log into a Heroku account and create a new app.
* On your app, change the Deployment Method on the Deploy tab to "GitHub."
* Search for your forked project and connect your repository.
* On the Resources tab, search for "mLab" under Add-ons.  Add the mLab add-on, choosing the free sandbox plan. This will automatically add the environment variable for `MONGODB_URI`.
* On the Settings tab, add [the necessary environment variables](#environment-variables).
* On the Deploy tab, perform a manual deployment of the master branch.  Once the deployment is complete, you should be able to open your app.


## Local Setup

* Clone the repository locally.
* If you don't have Node installed, [install it](https://nodejs.org/en/download/).
* In a console window, navigate to the repository directory and install the dependencies with `npm install`.
* Create a new file at the root of the repository directory with the name `.env`.  Add [the necessary environment variables](#environment-variables).
* In your console window, execute `npm start` to launch the application.  It will be viewable in your browser at [http://localhost:3000/](http://localhost:3000/).


## Available scripts

+ `npm start` - run nodejs in development mode,
+ `npm run server:dev` - same as `npm start`,
+ `npm run server:prod` - run nodejs in productions mode for deployment,
+ `npm run assets:dev` - watch public assets in development mode,
+ `npm run assets:prod` - build public assets to for deployment,
+ `npm run clean` - clean build folder,
+ `npm run build` - build project throw babel,
+ `npm run samples` - drop all database and load setup samples,
+ `npm run samples:load` - load all database samples,
+ `npm run samples:drop` - drop all database,


## Environment Variables
The below environment variables are needed to get the application up and running.

* `SITE_NAME` - Name of your site.
* `GOOGLE_CLIENT_ID` - google developer account id.
* `GOOGLE_CLIENT_SECRET` - google developer account secret.
* `GOOGLE_CALLBACK_URL` - OAuth redirect after success login using Google.
* `FACEBOOK_CLIENT_ID` - Facebook developer account id.
* `FACEBOOK_CLIENT_SECRET` - Facebook developer account secret.
* `FACEBOOK_CALLBACK_URL` - OAuth redirect after success login using Facebook.
* `MONGODB_URI` - this only needs to be added manually if you are A) working locally or B) using your own mLab instance that you didn't provision through Heroku.
* `PORT` - Port for starting your application on.
* `SESSION_SECRET` - Sessions secret.
* `SESSION_TIMEOUT_IN_HOURS` - Session time to expire.
* `COOKIES_MAX_AGE_IN_HOURS` - Cookies time to expire.
* `NODE_ENV` - Node enviroment mode, it can be development or deploy, errorhandler package depend on development env.
* `MAIL_HOST` - Nodemailer mailer Host.
* `MAIL_PORT` - Nodemailer mailer port.
* `MAIL_USER` - Nodemailer email address from which you will send notification emails.
* `MAIL_PASS` - Nodemailer password for mailer user.
* `MAIL_SENDER` - Hireo E-mail.
* `MINIMUM_PASSWORD_LENGTH` - the minimum length of user passwords.
* `PASSWORD_HASH_ROUNDS` - the number of rounds for bcrypt to apply its hashing algorithm.  The higher the rounds, the more secure the password is, but the more computing power is needed to hash passwords.  [Choose a number that best balances security and performance](http://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993).
* `PASSWORD_RESET_TIME_LIMIT_IN_HOURS` - the amount of time a user has to reset their password if they go through the "Forgot Password" process.
* `UPLOAD_STORAGE` - Attachment's upload folder path.
* `ATTATCHMENT_MAX_SIZE_IN_MB` - Attachment maximum file size in MB.
* `JOB_EXPIRATION_TIME_IN_DAYS` - Job Module expiration time in days.
* `LOCATION_RANGE_IN_KM` - Search location range in KM.

## Sample Data

To load sample data, run the following command in your terminal:
```bash
npm run samples
```

That will populate 3 accounts based on 3 roles (admin, employer, freelancer). The logins for the accounts are as follows:

|Role|Name|Email (login)|Password|
|---|---|---|---|
|admin|system admin|admin@admin.com|WubbaLubbaDubDub1234$|
|employer|Burger King|burger-king@employer.com|WubbaLubbaDubDub1234$|
|freelancer|David Pterson|david-peterson@freelancer.com|WubbaLubbaDubDub1234$|


## Demo
comming soon.


## License
(The MIT License)

Copyright (c) Mohamed Ashraf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
