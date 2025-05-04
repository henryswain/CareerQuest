//new api, rest api, get method, lambda proxy integration enabled, 
//query strings: 
//crud_type - required 
//user_id - required 
//profile - not required
//might also have to change some variables in lambda code but I can do that sunday

import {DynamoDBClient, PutItemCommand, ExecuteStatementCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event) => {
  const client = new DynamoDBClient({ region: "us-east-2" });
  const qs = event.queryStringParameters || {};

  const crud_type = qs.crud_type;
  const user_id = qs.user_id;
  let profile = {};

  if (!crud_type || !user_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing user_id or crud_type" })
    };
  }

  if (qs.profile) {
    try {
      profile = JSON.parse(decodeURIComponent(qs.profile));
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON in profile" })
      };
    }
  }

  try {
    if (crud_type === "profile-create") {
      // Read profile
      const getQuery = new ExecuteStatementCommand({
        Statement: `SELECT profile FROM "userProfile" WHERE id = ?`,
        Parameters: [{ S: user_id }]
      });
      const result = await client.send(getQuery);
      const existing = result.Items?.[0]?.profile
        ? unmarshall(result.Items[0].profile)
        : {};

      // Keep existing/add new fields
      const mergedProfile = { ...profile, ...existing };

      // Save to DynamoDB
      const putCommand = new PutItemCommand({
        TableName: "userProfile",
        Item: {
          id: { S: user_id },
          profile: { M: formatAsDynamoMap(mergedProfile) }
        }
      });
      await client.send(putCommand);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Profile merged and saved" })
      };
    }

    if (crud_type === "profile-read") {
      const getQuery = new ExecuteStatementCommand({
        Statement: `SELECT profile FROM "userProfile" WHERE id = ?`,
        Parameters: [{ S: user_id }]
      });

      const result = await client.send(getQuery);
      const item = result.Items?.[0];

      return {
        statusCode: 200,
        body: JSON.stringify(item?.profile ? unmarshall(item.profile) : {})
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid crud_type" })
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: err.message })
    };
  }
};

// JS object to DynamoDB
function formatAsDynamoMap(obj) {
  const format = (val) => {
    if (typeof val === "string") return { S: val };
    if (typeof val === "number") return { N: val.toString() };
    if (typeof val === "boolean") return { BOOL: val };
    if (Array.isArray(val)) return { L: val.map(format) };
    if (val && typeof val === "object") return { M: formatAsDynamoMap(val) };
    return { NULL: true };
  };

  const result = {};
  for (const key in obj) {
    result[key] = format(obj[key]);
  }
  return result;
}
