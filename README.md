# Test-Driven Development with Node and Typescript

Created: May 28, 2021 2:55 PM
Tags: Dev, Node, Typescript

This article was inspired by Darian Sampare's awesome TDD tutorial over on [YouTube](https://www.youtube.com/watch?v=QVxxgEyZt9Y).  If you'd rather learn by reading, you can find his project repository [here](https://github.com/justDare/typescript-express-starter).

# Initializing Project Files

This project assumes both Node and NPM are installed to the user's local machine.

**First, create the project folder and initialize a `package.json` file**

```bash
$ mkdir ts-express && cd ts-express
$ npm init
```

**Next, install `express` and `dotenv`**

```bash
$ npm i --save express dotenv
```

**Additionally, install some developer dependencies**

```bash
$ npm i -D mocha chai typescript nodemon supertest ts-node tsconfig-paths
```

**Lastly, install the needed type dependencies**

```bash
$ npm i -D @types/chai @types/mocha @types/node @types/supertest @types/express
```

**The package.json file should now look like this:**

```json
{
  "name": "ts-express",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/chai": "^4.2.18",
    "@types/mocha": "^8.2.2",
    "@types/node": "^15.6.1",
    "@types/supertest": "^2.0.11",
    "chai": "^4.3.4",
    "mocha": "^8.4.0",
    "nodemon": "^2.0.7",
    "supertest": "^6.1.3",
    "ts-node": "^10.0.0",
    "tsconfig-paths": "^3.9.0",
    "typescript": "^4.3.2"
  }
}
```

Now, in order to be able to run the Node server with Typescript, we will need to modify the `scripts` object in `package.json`.

**Modify the `scripts` object in `package.json`:**

```json
"scripts": {
    "build": "tsc -p .",
    "dev": "NODE_ENV=dev nodemon -r tsconfig-paths/register src/app.ts",
    "test": "NODE_ENV=test mocha --check-leaks -r tsconfig-paths/register -r ts-node/register \"test/**/*.spec.ts\""
  },
```

This gains us access to certain scripts that can run our testing processes.  Next, we are going to create a `tsconfig.json` file.

**To create the `tsconfig.json` file:**

```bash
$ tsc --init
```

If you get any sort of error such as "command not found: tsc", make sure Typescript is installed globally.  If you need to install Typescript globally, simply run

```bash
$ npm install typescript -g
```

In the newly-created `tsconfig.json` file, locate the four key/value pairs `"outDir"`, `"rootDir"`, `"moduleResolution"`, and `"baseUrl"`.  These will initally be commented out, so be sure to un-comment them to ensure your changes are active.

**Change the following in `tsconfig.json` from:**

```json
...
// "outDir": "./",
// "rootDir": "./,"
...
// "moduleResolution": "node",
// "baseUrl": "./",
...
```

**to:**

```json
...
"outDir": "./dist",
"rootDir": "./src,"
...
"moduleResolution": "node",
"baseUrl": "./src",
...
```

At this point the project file structure should look like so:

- 📁  ts-express
    - 📁  node_modules
    - 📄  package-lock.json
    - 📄   package.json
    - 📄   tsconfig.json

# Create a Test Folder

To actually run our tests, we will need a `test` folder.  This is where we instructed Node to look for our test files when we edited the `scripts.test` value in `package.json`.  Inside the project folder, create a new folder named `test`.  The `test` folder should contain a subfolder named `server`.  Inside the `server` folder, create a file named `server-runs.spec.ts`.  Following these steps, the project structure should look like so:

- 📁  ts-express
    - 📁  node_modules
    - 📁  test
        - 📁  server
            - 📄  server-runs.spec.ts
    - 📄  package-lock.json
    - 📄   package.json
    - 📄   tsconfig.json

# Defining basic Tests

Using the `mocha` package we installed previously, we are able to call a method called `describe()`.  This method allows us to name a test, provide a brief description of the test to be performed, and define some function to be tested.  To demonstrate this, head over to the `server-runs.spec.ts` file inside the `server` folder.  **Inside this file, add:**

```tsx
describe('Server checks', () => {
	it('server is created without error', () => {
		console.log('hello world')
	})
})
```

**Now, in the terminal, run the command**

```bash
$ npm test
```

This will execute the tests we set up and return the success messages in the terminal.

# Tests to Code

So far, we have a single test running.  This test does nothing more than log some text to the console.  While this progress is great, it doesn't really prove that we've written solid, clean code just yet.  What we need to do is spin up a server app using *[Express](https://expressjs.com/)* and test its validity.  Let's first write our test.  You should **always** write tests before code.  Not only does this help you think through what functionality you need, but it also keeps your code objective and testable.  

**In the `server-runs.spec.ts`, modify the existing code from:**

```tsx
describe('Server checks', () => {
	it('server is created without error', () => {
		console.log('hello world')
	})
})
```

**to:**

```tsx
import request from 'supertest'
import { expect } from 'chai'

describe('Server checks', () => {
  it('server is created without error', (done) => {
    request(app).get("/").expect(200, done)
  })
})
```

At this point, Typescript will be giving you an error that "app" cannot be found.  Let's create it.  To do so we need to do two things:

1. **Create a new folder named `src` in the root project directory.**
2. **Inside that new `src` folder, create a new file `server.ts`.**

**Inside `server.ts`, add the following code:**

```tsx
import express, { Application, Request, Response, NextFunction } from "express"

export default function createServer() {
  const app: Application = express()

  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello world!')
  })

  return app
}
```

At this point, it's important to notice a few things.  Notice the imports inside `express`.  These are special types that Typescript will require us to use.  These help us keep our code structured and types static.  The code above does nothing more than create and pass out a simple `express` application that can be instantiated elsehwere (like in our tests).

Now, let's fix that "app" error in `server-runs.spec.ts`.  **Right above the `describe` statement, add the following code:**

```tsx
...
import createServer from 'server'
const app = createServer()
...
```

**The `server-runs.spec.ts` file should now look like this:**

```tsx
import request from 'supertest'
import { expect } from 'chai'

import createServer from 'server'
const app = createServer()

describe('Server checks', () => {
  it('server is created without error', (done) => {
    request(app).get("/").expect(200, done)
  })
})
```

**To test the validity of the code we just wrote run the tests again:**

```bash
$ npm test
```

Congrats!  That is our first connected, valid test passing.

# Expanding Testing

Up until now all our test have been very simple or only involved a single file.  Let's expand on that:

1. Create a new folder in the `test` folder and name it `routes`.
2. Inside the new `routes` folder, add a subfolder named `auth`.
3. Inside the `auth` folder, add a file named `index.spec.ts`

**At this point, the project folder structure should look like so:**

- 📁  ts-express
    - 📁  node_modules
    - 📁  src
        - 📄  server.ts
    - 📁  test
        - 📁  routes
            - 📁  auth
                - 📄  index.spec.ts
        - 📁  server
            - 📄  server-runs.spec.ts
    - 📄  package-lock.json
    - 📄   package.json
    - 📄   tsconfig.json

**Inside the `index.spec.ts` file in the `auth` folder, add the following code:**

```tsx
import request from 'supertest'
import { expect } from 'chai'

import createServer from 'server'
const app = createServer()

describe('Auth routes', () => {
  it('/auth responds with 200', (done) => {
    request(app).get('/auth').expect(200, done)
  })
})
```

This test attempts to connect to a `/auth` endpoint on our server and recieve a status code of `200`.  If you run `npm test` you will notice this test fails.  Why is that?  Not only do we recieve a `404` status code instead of a `200` status code, but we've not even set this endpoint up yet.  Hopefully by this point, you're able to notice the power of Test-Driven Development (TDD).  By preceding our code with clearly-defined tests, we help reduce the number of possible mistakes in our code by first only writing what our tests expect us to write.

**To make this test run successfully:**

1. In the Project directory, in the `src` folder, add a subfolder `routes`.
2. In the new `routes` folder, add two files– `auth.ts` and `index.ts`.

**At this point, the project file structure should look like this:**

- 📁  ts-express
    - 📁  node_modules
    - 📁  src
        - 📁  routes
            - 📄  auth.ts
            - 📄  index.ts
        - 📄  server.ts
    - 📁  test
        - 📁  routes
            - 📁  auth
                - 📄  index.spec.ts
        - 📁  server
            - 📄  server-runs.spec.ts
    - 📄  package-lock.json
    - 📄   package.json
    - 📄   tsconfig.json

**Inside the `auth.ts` file, add the following code:**

```tsx
import { Router, Request, Response } from 'express'

const router = Router()

// @route GET /auth
// @desc Authenticate a user
// @access PUBLIC

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

export default router
```

As you can see, route does nothing more than send a `200` status code, which will help validate our test.  

**Inside the `index.ts` file, add the following code:**

```tsx
import { Router } from 'express'
import auth from './auth'

const router = Router()

router.use('/auth', auth)

export default router  
```

Notice two things– `import auth` and `router.use(...)`.  This `index.ts` file will be the central hub for any routes we need to configure.  Any additonal routes would need their own `.ts` route file in the `routes` folder (similar to `auth.ts`) and would need to be imported into `index.ts`.  Since our `auth.ts` file exports the `router` that we configured inside the file, importing it will bring the auth router into our `index.ts` file.  Lastly, we invoke `router.use()` to add subsequent routes to our main router.  Any additional routes we create would need their own `import` and `router.use()` method inside `index.ts`.

**To test the validity of the code we just wrote run the tests again:**

```bash
$ npm test
```

All the tests should be passing at this point.

## (Optional) Configure Additional Routes

To configure additional routes, we will adhere to the following process:

1. Create a new test folder in the `test/routes` folder for the route
2. Create a new `index.spec.ts` file in this test folder
3. Write a new test
4. Add a new route file in the `src/routes` folder
5. Import the new route file into `src/routes/index.ts` and invoke `router.use()` for that route.

### Example: Adding a Dashboard

**With the proper test files and subfolders created, the `test` folder structure should look like so:**

- 📁  test
    - 📁  routes
        - 📁  auth
            - 📄  index.spec.ts
        - 📁  dashboard
            - 📄  index.spec.ts
    - 📁  server
        - 📄  server-runs.spec.ts

**Inside `test/routes/dashboard/index.spec.ts`:**

```tsx
import request from 'supertest'
import { expect } from 'chai'

import createServer from 'server'
const app = createServer()

describe('Dashboard routes', () => {
  it('/dashboard responds with 200', (done) => {
    request(app).get('/dashboard').expect(200, done)
  })
})
```

**To test the validity of the test we just wrote:**

```bash
$ npm test
```

The `/dashboard` route test should be failing, since we've not written any actual `dashboard` code yet.

**With the proper route file created, the `src/routes` folder should look like so:**

- 📁  src
    - 📁  routes
        - 📄  auth.ts
        - 📄  dashboard.ts
        - 📄  index.ts
    - 📄  server.ts

**Inside `src/routes/dashboard.ts`:**

```tsx
import { Router, Request, Response } from 'express'

const router = Router()

// @route GET /dashboard
// @desc Authenticate a user's dashboard
// @access PUBLIC

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

export default router
```

**Inside `src/routes/index.ts`:**

```tsx
import { Router } from 'express'
import auth from './auth'
import dashboard from './dashboard'

const router = Router()

router.use('/auth', auth)
router.use('/dashboard', dashboard)

export default router
```

**To test the validity of the test and route we just created:**

```bash
$ npm test
```

The `/dashboard` route test should be passing, since we've now created a `dashboard` route.

## Configuring a Server

By standard development conventions, we need a few things for our server.  First, we need a `.env` environment file where we can define some global environment variables.  Next, we will also need a `app.ts` file, where we will create our server/app.

**In the main project directory (`ts-express`), create the file `.env` and add the following code:**

```tsx
PORT = 5000
```

This is the port in which our server will run on.  `5000` is standard convention, but this value can be modified based on the available ports of the development machine.

**Next, in the `/src` folder, create the file `app.ts` and add the following code:**

```tsx
import 'dotenv/config'
import express, { Application, Request, Response, NextFunction } from 'express'
import createServer from 'server'

const startServer = () => {
  const app = createServer()
  const port: number = parseInt(<string>process.env.PORT, 10) || 4000

  app.listen(port, () => {
    console.log(`server running on port ${port}`)
  })
}

startServer()
```

Here, we define a `startServer()` function which will listen on the port we defined in `.env`. 

**At this point, the project file structure should look like this:**

- 📁  ts-express
    - 📁  node_modules
    - 📁  src
        - 📁  routes
            - 📄  auth.ts
            - 📄  dashboard.ts
            - 📄  index.ts
        - 📄  app.ts
        - 📄  server.ts
    - 📁  test
        - 📁  routes
            - 📁  auth
                - 📄  index.spec.ts
            - 📁  dashboard
                - 📄  index.spec.ts
        - 📁  server
            - 📄  server-runs.spec.ts
    - 📄  .env
    - 📄  package-lock.json
    - 📄   package.json
    - 📄   tsconfig.json

**Finally, run the server using**

```bash
$ npm run dev
```

This will start the development server and begin listening for incoming requests on port `5000`.

## Congrats!!! 🎉🎉🎉

You've just create your first Node JS app using Test-Driven Development.  If you get stuck on any code, check out Darian Sampare's project GitHub repo [here](https://github.com/justDare/typescript-express-starter).  Good luck, and happy coding!# fm-data-typescript
