import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Img from "gatsby-image";

const IndexPage = () => {
  const dogs = useStaticQuery(graphql`
    query DogQuery {
      allDog {
        nodes {
          id
          breed
          remoteImage {
            childImageSharp {
              id
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `);

  return (
    <main>
      <h1>Doggos</h1>

      {dogs.allDog.nodes.map((dog) => (
        <article key={dog.id}>
          <h2>{dog.breed}</h2>

          <Img
            fluid={dog.remoteImage.childImageSharp.fluid}
            alt={dog.breed}
            style={{ width: "100px" }}
          />
        </article>
      ))}
    </main>
  );
};

export default IndexPage;
