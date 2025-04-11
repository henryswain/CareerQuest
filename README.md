# CareerQuest

## Project overview
- Target Audience: CareerQuest is designed for Job seekers who are actively looking for jobs online
- Tech stack: (VueJS, Node.js, DynamoDB, Bootstrap)
- Status: In development

## Archetacture Overview
- Frontend framework: VueJS (version 3 with composition api)
- Backend framework: Node.js (files held in AWS Lambda), amplify gen 2 for authentication
- Database: AWS DynamoDB
- Authentication: AWS Amplify Authenticator Gen 2
- API Style: REST APIs (held on AWS API Gateway)

## Developemnt Setup
Prerequisites
- AWS Account (for setting up and using dynamodb, lambda, and api gateway)

Clone and Install - frontend

- `git clone https://github.com/henryswain/informatics-capstone-project-post-sprint-2.git`
- `cd informatics-capstone-project-post-sprint-2`
- `npm install`

install and setup - backend

- two lambda functions need to be created.
- the contents of the fuctions can be found in the two mjs files found in the Lambda_function_code directory.
- along with those two functions, two APIs need to be setup through AWS API Gateway
- one API needs to be setup to recieve "id" as a query string paramenter, and call the "add-id-to-user-data-on-login" function on AWS Lambda
- the other API needs to be setup to recieve "id", "crud_type", and "job_id" as query string parameters and call. both "id" and "crud_type", need to be required, but "job_id" must not, since "job_id" isn't used for every crud_type/use case of function, but "id" and "crud_type" are. 
- dynamodb table with primary key id (string)

amplify authentication setup 
- `npx ampx sandbox` to generate amplify_outputs.json
- create .env.local file for storing environment variables necessary for authentication.

```
VITE_AWS_REGION=
VITE_USER_POOL_ID=
VITE_USER_POOL_CLIENT_ID=
VITE_IDENTITY_POOL_ID=

VITE_DATA_API_URL=
VITE_DATA_AWS_REGION=
```
- set environment variables to the corresponding info in amplify_outputs.json
- replace sensitive information with the environment variables using syntax like this

`"user_pool_id": "${VITE_USER_POOL_ID}",`

To run the program 
- `npm run dev`

## Deployment
- create new amplify app
- select upload from github
- select the repository
- under advanced, add the same environment variables
- note, the first deployement will take a while to complete.

## Project Structure
```
.
├── amplify
│   ├── auth
│   │   └── resource.ts
│   ├── backend.ts
│   ├── data
│   │   └── resource.ts
│   ├── package.json
│   └── tsconfig.json
├── amplify_outputs.json
├── DEPRECIATED_FILES
│   ├── CQ_logo.svg
│   ├── examplecsvtodb.py
│   ├── home-page-bg-TEMP.jpg
│   ├── job.wsgi
│   ├── jobview.wsgi
│   └── mysqlsample.wsgi
├── index.html
├── jsconfig.json
├── lambda_function_code
│   ├── add-id-to-user-data-on-login.mjs
│   └── handle-saved-jobs.mjs
├── package-lock.json
├── package.json
├── public
│   ├── cq_icon.ico
│   └── favicon.ico
├── README.md
├── Sprint 2
│   └── informatics-capstone-project-main
├── Sprint2Artifact
│   └── informatics-capstone-project-main
│       ├── amplify
│       │   ├── auth
│       │   │   └── resource.ts
│       │   ├── backend.ts
│       │   ├── data
│       │   │   └── resource.ts
│       │   ├── package.json
│       │   └── tsconfig.json
│       ├── amplify_outputs.json
│       ├── DEPRECIATED_FILES
│       │   ├── CQ_logo.svg
│       │   ├── examplecsvtodb.py
│       │   ├── home-page-bg-TEMP.jpg
│       │   ├── job.wsgi
│       │   ├── jobview.wsgi
│       │   └── mysqlsample.wsgi
│       ├── index.html
│       ├── jsconfig.json
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   └── favicon.ico
│       ├── src
│       │   ├── App.vue
│       │   ├── assets
│       │   │   ├── base.css
│       │   │   ├── bg_darkmode.png
│       │   │   ├── bg_lightmode.png
│       │   │   ├── CQ_logo_darkmode.svg
│       │   │   ├── CQ_logo_lightmode.svg
│       │   │   ├── Jobs_NYC_Postings.csv
│       │   │   ├── main.css
│       │   │   └── user.png
│       │   ├── main.js
│       │   ├── pages
│       │   │   ├── FindJobs.vue
│       │   │   ├── HomePage.vue
│       │   │   ├── Login.vue
│       │   │   ├── ProfilePage.vue
│       │   │   ├── Register.vue
│       │   │   ├── SavedJobs.vue
│       │   │   └── Settings.vue
│       │   └── router.js
│       ├── vite.config.js
│       └── weeky-reports
│           ├── idea.txt
│           ├── Team weekly report - week 2.txt
│           ├── Team weekly report - week 3 .txt
│           ├── Team weekly report - Week 4.txt
│           ├── Team weekly report - week 5 .txt
│           ├── Team weekly report - week 6.txt
│           └── Team weekly report.txt
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── base.css
│   │   ├── bg_darkmode.png
│   │   ├── bg_lightmode.png
│   │   ├── CQ_logo_darkmode.svg
│   │   ├── CQ_logo_lightmode.svg
│   │   ├── Jobs_NYC_Postings.csv
│   │   ├── main.css
│   │   └── user.png
│   ├── main.js
│   ├── pages
│   │   ├── FindJobs.vue
│   │   ├── HomePage.vue
│   │   ├── Login.vue
│   │   ├── ProfilePage.vue
│   │   ├── Register.vue
│   │   ├── SavedJobs.vue
│   │   └── Settings.vue
│   └── router.js
├── vite.config.js
└── weeky-reports
    ├── idea.txt
    ├── Team weekly report - week 2.txt
    ├── Team weekly report - week 3 .txt
    ├── Team weekly report - Week 4.txt
    ├── Team weekly report - week 5 .txt
    ├── Team weekly report - week 6.txt
    ├── Team weekly report - week 7.txt
    ├── Team weekly report - week 8.txt
    └── Team weekly report.txt

23 directories, 93 files
```
