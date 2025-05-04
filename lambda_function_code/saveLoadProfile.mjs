import { DynamoDBClient, ExecuteStatementCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event) => {
  const client = new DynamoDBClient({ region: "us-east-2" });
  const qs = event.queryStringParameters || {};


  //Query strings, first two are required, third is optional
  const crud_type = qs.crud_type;
  const user_id = qs.user_id;
  const rawProfile = qs.profile;

  if (!crud_type || !user_id) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: "Missing required query parameters: user_id or crud_type" }),
    };
  }
  //read profile from user id, if no user then add empty profile with ID
  if (crud_type === "profile-read") {
    const query = `SELECT * FROM "userProfile" WHERE id='${user_id}'`;
    const command = new ExecuteStatementCommand({ Statement: query });

    try {
      const result = await client.send(command);
      const items = result.Items.map(unmarshall);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(items[0] || {}),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "Error reading profile", details: err.message }),
      };
    }
  }
  //update profile with new entered info
  if (crud_type === "profile-create") {
    if (!rawProfile) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "Missing profile data for profile-create" }),
      };
    }

    let profile;
    try {
      profile = JSON.parse(decodeURIComponent(rawProfile));
    } catch (err) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "Invalid profile JSON", details: err.message }),
      };
    }

    const item = {
      id: user_id,
      ...profile,
    };
  //put entered fields into userProfile dynamoDB
    const command = new PutItemCommand({
      TableName: "userProfile",
      Item: marshall(item),
    });

    try {
      await client.send(command);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ message: "Profile saved successfully" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "Error saving profile", details: err.message }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({ error: "Unsupported crud_type" }),
  };
};