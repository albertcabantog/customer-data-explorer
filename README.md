# README #

React frontend application integrated with AWS Lambda to retrieve and display customer data in a paginated format.

## Prerequisite ##
The frontend application is written in React + Typescript.  
The following should be installed to build and run the application:

* node v24.11.1
* npm 11.6.2
* git 2.42 or higher
* localstack 3.5.1 (for local setup provisiong AWS Lambda and AWS API Gateway)
* cdklocal v3.0.1 (for local setup deploying the AWS stack)
* cdk cli version v2.1033.0
* aws-cli version 1.33.24
* docker version 24.0.6 (for local setup)

## Build ##

* Clone this code base

```
git clone https://github.com/albertcabantog/customer-data-explorer.git
```

* The backend lambda function is deployed in AWS using `cdk`.  To install this in a `localstack` setup, navigate to `customer-lambda-app` folder and run the command below.

```
cdklocal deploy
```
This will output the corresponding API Gateway URL for accessing the lambda function.  Use this to replace the value `VITE_CUSTOMER_API_URL` in the `frontend/.env` file.

* The frontend application is using `vite` build tool that has a dev server to access the application thru browser.

```
npm run dev
```

You can now access the application in a browser http://localhost:5173/

## Frontend Unit tests ##

To run the frontend unit test with `vitest` framework, run the following command:

```
npm run test
```


## Deployment ##

The frontend application can be deployed locally in a dev server.  To have the application bundled for hosting in a server:

* Run `npm run build`

This will create the `dist` folder with all the bundled files ready for deployment distribution.



## Data Source ##

The lambda application retrieves the data from its in-memory test data. 