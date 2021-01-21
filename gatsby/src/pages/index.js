import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

const IndexPage = () => {
  const dogs = useStaticQuery(graphql`
    query DogQuery {
      allDog {
        nodes {
          id
          breed
        }
      }
    }
  `);

  return (
    <main>
      <h1>Doggos</h1>

      {dogs.allDog.nodes.map((dog) => (
        <h2 key={dog.id}>{dog.breed}</h2>
      ))}
    </main>
  );
};

export default IndexPage;
