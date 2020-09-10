module.exports = async function (client, language, identifier) {
  doc = await client.db.collection("messages").findOne(
    {
      language: language,
      identifier: identifier,
    },
    { projection: { _id: false } }
  );
  if (doc) {
    return doc;
  } else {
    console.error(
      `Error, no message found for lang: ${language} and id: ${identifier}`
    );
    return "Error";
  }
};
