// the purpose of this function is to handle the updating and reading of the saved job_ids that corespond to the user

// The dynamodb table that this function reads from and updates has two columns:
// 1) id - user id
// 2) job_ids - list containing all job ids that the user has clicked save job for:

// if the function is called with "crud_type" set to "create", it adds the provided  
// "job_id" from the event to the "job_ids" column for the row where "id" is equal to the "id" 
// from the event. if the function is called with "crud_type" set to "delete", it deletes the provided
//  "job_id" from the event from the "job_ids" column for the row wherre "id" is equal to the 
//  "id" from the event. finally if the function is  called  with "crud_type" set to "read", 
// it returns the contens of the list from the "job_ids" column.

// the function will becalled with read whenever the user navigates to the saved jobs page. it will also be called with 
// create and delete when a user adds or removes a job from the saved jobs page respecively.

// For the function to work, must be coppied to a lambda function in AWS Lambda, and be setup to work with 
// API Gateway. The lambda function with be called from a REST API setup through API gateway. The API needs to be setup to 
// recieve "id" (the user id that is active when a user signs in through the amplify authenticator in App.vue), as well as the "crud_type", and optional 
// "job_id" as query string parameters, and will send it to the lambda function using the event. 

// the "event" will look something like 

// {
//     "id": "<some user id>",
//     "crud_type": "<crud type (e.g. create, delete, or read)>",
//     "job_id": "<some job id>"
// }


// import necessary libraries for connecting to dynamodb and executing partiql queries
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event) => {
  console.log("function called")

  const client = new DynamoDBClient();

  // store keys from event in variables
  const user_id = event.user_id
  const job_id = event.job_id

  // partiql query text to get all job ids for the user
  const getAllJobIdsOfUserQuery = `SELECT job_ids FROM "user-data" WHERE id = '${user_id}'`

  // connect to dynamodb table and execute query
  const getAllJobIdsOfUserInput = {
    Statement: getAllJobIdsOfUserQuery,
  };
  const getAllJobIdsOfUserCommand = new ExecuteStatementCommand(getAllJobIdsOfUserInput)
  const AllJobIdsOfUser = await client.send(getAllJobIdsOfUserCommand)

  // unpack results into proper format using unmarshall
  for (let i = 0; i < AllJobIdsOfUser.Items.length; i++) {
    AllJobIdsOfUser.Items[i] = unmarshall(AllJobIdsOfUser.Items[i]);
  }

  // if the user is adding a new job id to the list
  if (event["crud_type"] == "create") {

    // partiql query text to update the list to include the new job id as well
    const addSavedJobQuery = `UPDATE "user-data" SET job_ids = list_append(if_not_exists(job_ids, []), ['${job_id}']) WHERE id = '${user_id}'`;

    // connect to dynamodb and execute query
    const addSavedJobsInput = {
      Statement: addSavedJobQuery
    };
    const updateSavedJobsCommand = new ExecuteStatementCommand(addSavedJobsInput)
    const updateUsersSavedJobs = await client.send(updateSavedJobsCommand)
    const response = {
      statusCode: 200,
      body: JSON.stringify(updateUsersSavedJobs),
    };
  } 

  // if the user has navigated to the the saved jobs page
  else if (event.crud_type == 'read') {

    // partiql query to read the contents of the list of job ids for the uesr.
    const sqlQuery = `SELECT job_ids FROM "user-data" WHERE id = '${user_id}'`
    
    // connect to dynamodb and execute query
    const readAllJobIDsInput = {
      Statement: sqlQuery
    };

    const readAllJobIDsInputCommand = new ExecuteStatementCommand(readAllJobIDsInput)
    const readAllJobIDs = await client.send(readAllJobIDsInputCommand)
    console.log("readAllJobIDs.Items: ", JSON.stringify(readAllJobIDs.Items))

    // unpack results from query into proper format using unmarshall
    for (let i = 0; i < readAllJobIDs.Items.length; i++) {
      readAllJobIDs.Items[i] = unmarshall(readAllJobIDs.Items[i]);
    }

    // return the properly formated result
    const response = {
      statusCode: 200,
      body: JSON.parse(JSON.stringify(readAllJobIDs.Items[0].job_ids))
    };
    return response
  } 

  // if the user clicks the remove from saved jobs button
  else if (event.crud_type == 'delete') {
   
    // gets the index of the job id to be removed since the remove operation in partiql is done by index
    const toBeRemovedIndex = AllJobIdsOfUser.Items[0].job_ids.indexOf(job_id)

    // partiql query text to remove the item from the list of job ids
    const removedSavedJobQuery = `UPDATE "user-data" REMOVE job_ids[${toBeRemovedIndex}] WHERE id='${user_id}'`

    // connect to dynamodb table and execute querys
    const removedSavedJobInput = {
      Statement: removedSavedJobQuery,
    };
    const removedSavedJobCommand = new ExecuteStatementCommand(removedSavedJobInput)
    const removedSavedJob = await client.send(removedSavedJobCommand)
    const response = {
      statusCode: 200,
      body: JSON.stringify(removedSavedJob),
    };
    return response
  }
};
