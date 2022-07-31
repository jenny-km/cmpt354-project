## CMPT 354 - Group 29 Project

## General Information:

- For the application, we have used HTML, CSS, JavaScript, and Node JS to create our application. Meanwhile, PostgreSQL was the Database Management System that we used for the application's database and heroku was used to host the application online.
- Our group project is currently hosted on heroku and can be accessed through this link: [CMPT 354 - Group 29 Project Application Link](https://cmpt354-project.herokuapp.com/)
- In this hosted website in heroku, the PostgreSQL database has already been created and set-up in advance to prevent any complications that may occur.
- The code itself can be accessed through [CMPT 354 - Group 29 Project Github Link](https://github.com/jenny-km/cmpt354-project). Please refer to the "How to set-up and run the application locally" section in case you are interested to test the application in your local computer.

## Record of Last Commit

```
PS C:\Users\Jennifer Kim\OneDrive\Documents\GitHub\cmpt354-project> git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
PS C:\Users\Jennifer Kim\OneDrive\Documents\GitHub\cmpt354-project> git log
commit 1f705e65ac82f2d0edc2c78380a5d54c65ebfbbd (HEAD -> main, origin/main, origin/HEAD)
Author: Jennifer Kim <jennykim029@gmail.com>
Date:   Sat Jul 30 18:52:23 2022 -0700
    updated ReadMe File
```

## How to Set-up and Run the Application Locally

Please follow the instructions listed below:

1. Download or Clone the application from this link [CMPT 354 - Group 29 Project Github Link](https://github.com/jenny-km/cmpt354-project). In the case you do not have access, please let me know your Github accounts so I may give you access to the repository.
2. Open a terminal or cmd to the root of the application, and run `npm install` for any dependencies that the application may need. Please make sure you have node js install to be able to run the `npm` command.
3. Please set-up your local database using PostgreSQL. You may use the cmd line or PgAdmin to run the queries. Please remember that you need to have PostgreSQL installed to do so.
4. Once you have PgAdmin or cmd set up, create a database called cmpt354_project and copy paste the contents found in the `postgres-create-database-script.txt` file and run the Query. You can find this file in the root directory of this project.
5. Go to the `index.js` file (not to confuse with the index.ejs file) and search for

```
ssl:{
  rejectUnauthorized: false
}
```

\*Please make sure to comment out this code as it is only needed for the heroku environment. It will prevent you from running locally if this part of the code is not commented out.

6. Since the database is already set up, we will need to check one last thing before running the code. In the `index.js` file, please search for the following piece of code. You will find it in the top section of the file.

```
var pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost cmpt354_project",
  // ssl:{
  //   rejectUnauthorized: false
  // }
})
```

Please take a look at this part of the code.
`"postgres://postgres:root@localhost cmpt354_project" `
The `root` is the password to your local database. This is needed for the program to have access to your local database. Meanwhile, `cmpt354_project` is the name of the database that we are accessing.
In the case that you have a different password for your local database. Please change `root` to your current password. On the other hand, if you created a database with a different name than `cmpt354_project`. Then please replace this with the name of your local database that you wish to access. 7. Once finished, please open up a terminal in the root directory.

7. Open a terminal in the root directory of the project and either run `nodemon ./index.js` OR `node index.js`
8. Then access the application locally in the browser through `http://localhost:5000/`.
