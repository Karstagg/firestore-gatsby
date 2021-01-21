require("dotenv").config({
  path: `.env`,
});

const fetch = require("node-fetch");
const fs = require("fs");

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  try {
    const activeEnv =
      process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

    if (activeEnv !== "production") {
      const feed = JSON.parse(fs.readFileSync("./dogs.sample.json"));
      createNodes(actions, createNodeId, createContentDigest, feed);

      return;
    }

    const response = await fetch(`${process.env.API_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (!response?.ok) {
      console.error("Cannot fetch dogs data.");
      return;
    }

    const dogs = await response.json();

    createNodes(actions, createNodeId, createContentDigest, dogs);
  } catch (err) {
    console.error(err);
  }
};

const DOG_NODE_TYPE = "Dog";

const createNodes = (actions, createNodeId, createContentDigest, dogs) => {
  const { createNode } = actions;

  dogs.forEach((entry) =>
    createNode({
      ...entry,
      id: createNodeId(`${DOG_NODE_TYPE}-${entry.id}`),
      parent: null,
      children: [],
      internal: {
        type: `${DOG_NODE_TYPE}`,
        content: JSON.stringify(entry),
        contentDigest: createContentDigest(entry),
      },
    })
  );
};

const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.onCreateNode = async ({
  node,
  actions: { createNode },
  createNodeId,
  getCache,
}) => {
  if (node.internal.type === DOG_NODE_TYPE) {
    const fileNode = await createRemoteFileNode({
      url: node.img_url,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    });
    if (fileNode) {
      node.remoteImage___NODE = fileNode.id;
    }
  }
};
