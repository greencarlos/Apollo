import React, { useState } from "react";
import ReactDOM from "react-dom";

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

  return (
    <div>
      {stars}
    </div>
  );
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

const AddLessons = () => {
  const pokemon = JSON.parse(localStorage.getItem("pokemon"));
  const [enrolled, setEnrolled] = useState([]);
  const [unenrolled, setUnenrolled] = useState(lessons);

  const Enroll = (lesson) => {
    setEnrolled([lesson, ...enrolled]);
    setUnenrolled(unenrolled.filter((name) => name !== lesson));
  };

  const Unenroll = (lesson) => {
    setUnenrolled([lesson, ...unenrolled]);
    setEnrolled(enrolled.filter((name) => name !== lesson));
  };

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

ReactDOM.render(<AddLessons />, document.querySelector(".addLessons"));
