// The purspose of the function is to ensure that the user ids of all registered users are stored once in the dynamodb table "user-data". It is called whenever 
// the amplify authenticator detects that a user has signed in. If the user doesn't exist in the table (this would happen when the user first registers, it adds
// the user id to the table. If the user id already exists, it does nothing.

// For the code to Work, it needs to be coppied to a lambda funtion on AWS Lambda and setup to work with AWS API gateway. The lambda function will be called from
// a REST API setup through AWS API gateway. The API needs to be setup to recieve "id" (the user id that is active when a user signs in through the amplify authenticator in App.vue) 
// as a query string parameter, and will send it to the lambda function using the event. 

// the "event" will look something like 

// {
//     "id": "<some user id>"
// }


// import necessary libraries for connecting to dynamodb and executing partiql queries
import { DynamoDBClient, ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {

// PartiQL query text for checking if id exists in dynamodb table (user-data)
  const sqlDoesIdExist = `SELECT * FROM "user-data" WHERE id = '${event.id}'`

// connecting to the dynamodb table, and executing the query
  const client = new DynamoDBClient();
  const input1 = {
    Statement: sqlDoesIdExist
  };

  const command1 = new ExecuteStatementCommand(input1);
  const response1 = await client.send(command1);
  // if the response doesn't return any items (the id doesn't exist in the table), the id is inserted into the table
//   if (response1) {

  if (JSON.stringify(response1.Items) == "[]") {
    console.log("inside if statement")

    // partiql  query text for inserting the id into the table
    const sqlInsert = `INSERT INTO "user-data" VALUE { 'id': '${event.id}'}`

    // connecting the dynamodb table and executing the query
    const input = {
      Statement: sqlInsert
    };
    const command = new ExecuteStatementCommand(input);
    const response = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  }
  // otherwise, don't add anything to the table and return a message indicating the the id already exists.
  else {
    console.log("inside else statement")
    const response = {
      statusCode: 200,
      body: JSON.stringify('id already exists. check dynamodb')
    };
    return response;
  }

};
