require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const fetch = require("node-fetch");

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  try {
    const rawResponse = await fetch(`${process.env.API_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (!rawResponse || !rawResponse.ok) {
      console.error("Cannot fetch dogs data.");
      return;
    }

    const dogs = await rawResponse.json();

    console.log(dogs);
  } catch (err) {
    console.error(err);
  }
};
