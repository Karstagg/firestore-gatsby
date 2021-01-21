import * as functions from "firebase-functions";
import { Request } from "firebase-functions/lib/providers/https";

import * as admin from "firebase-admin";
const app = admin.initializeApp();
app.firestore().settings({ timestampsInSnapshots: true });

interface Dog {
  id: string;
  breed: string;
  img_url: string;
}

const findDogs = async (): Promise<Dog[]> => {
  const snapshot = await admin.firestore().collection("dogs").get();

  if (!snapshot || !snapshot.docs) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as Dog;
  });
};

const validBearer = (request: Request): boolean => {
  const key = functions.config().dogs.key;

  const authorization = request.get("Authorization");
  const split = authorization ? authorization.split("Bearer ") : [];
  const bearerKey = split && split.length >= 2 ? split[1] : undefined;

  return key === bearerKey;
};

export const dogs = functions.https.onRequest(async (request, response) => {
  try {
    const isValidBearer: boolean = validBearer(request);

    if (!isValidBearer) {
      response.status(400).json({
        error: "Not Authorized",
      });
      return;
    }

    const dogs: Dog[] = await findDogs();

    response.json(dogs);
  } catch (err) {
    response.status(500).json({
      error: err,
    });
  }
});
