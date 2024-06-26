import React, { useState } from "react";
import * as ReactDOM from "react-dom/client";
import {
  ApolloClient,
  useQuery,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

client.query({
  query: gql`
    query Query {
      lessons {
        title
      }
    }
  `,
});

const LESSON_QUERY = gql`
  query Query {
    lessons {
      title
    }
  }
`;

const Stars = () => {
  const [value, setValue] = useState(0);

  const stars = [1, 2, 3, 4, 5].map((star, i) => {
    let iconClass = star <= value ? "fas" : "far";

    return (
      <i
        className={`${iconClass} fa-star star`}
        key={star}
        onMouseMove={() => {
          setValue(star);
        }}
      ></i>
    );
  });

  return <div>{stars}</div>;
};

const AddLessons = () => {
  const { loading, error, data } = useQuery(LESSON_QUERY);
  const pokemon = JSON.parse(localStorage.getItem("pokemon"));
  const [enrolled, setEnrolled] = useState([]);
  const [unenrolled, setUnenrolled] = useState(data.lessons.map(e) => e.title);

  const Enroll = (lesson) => {
    setEnrolled([lesson, ...enrolled]);
    setUnenrolled(unenrolled.filter((name) => name !== lesson));
  };

  const Unenroll = (lesson) => {
    setUnenrolled([lesson, ...unenrolled]);
    setEnrolled(enrolled.filter((name) => name !== lesson));
  };

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error</h3>;

  return (
    <div className="container">
      <div>{pokemon.name}</div>
      <img src={pokemon.image} />
      <h1>Enrolled:</h1>
      <hr />
      <div>
        {enrolled.map((lesson, idx) => (
          <div>
            <div key={idx} onClick={() => Unenroll(lesson)}>
              {lesson}
            </div>
            <Stars />
          </div>
        ))}
      </div>

      <h1>Unenrolled:</h1>
      <hr />

      <div>
        {unenrolled.map((lesson, idx) => (
          <div key={idx} onClick={() => Enroll(lesson)}>
            {lesson}
          </div>
        ))}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector(".addLessons"));

root.render(
  <ApolloProvider client={client}>
    <Stars />
  </ApolloProvider>
);

