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

    return <></>;

    return (
      <i
        className={`${iconClass} fa-star star`}
        key={star + i + value}
        onMouseMove={() => setValue(star)}
      ></i>
    );
  });

  console.log("stars", stars);
  return <div>{stars}</div>;
};

const lessons = await fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `{ lessons {title} } `,
  }),
})
  .then((res) => res.json())
  .then((res) => {
    return res.data.lessons.map((lesson) => {
      return lesson.title;
    });
  });

const AddLessons = async () => {
  const { loading, error, data } = useQuery(LESSON_QUERY);
  const pokemon = JSON.parse(localStorage.getItem("pokemon"));

  const [enrolled, setEnrolled] = useState([]);
  const [unenrolled, setUnenrolled] = useState([]);
  console.log(
    "loading",
    loading,
    "data",
    data.lessons.map((ele) => ele.title)
  );

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
