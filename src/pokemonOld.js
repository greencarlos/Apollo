import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const Pokemon = () => {
  const [monster, setMonster] = useState({
    name: "",
    image: null,
  });

  const [profile, setProfile] = useState(<div></div>);

  const listNames = async (pokemon) => {
    const list = await fetch("/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `{search(str: "${pokemon}") {name }}`,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        return result.data;
      });

    const monsterNames = list.search.map((monster, idx) => {
      const MLen = monster.name.length;
      const pLen = pokemon.length;

      const pokeIdx = monster.name.indexOf(pokemon);
      const start = monster.name.slice(0, pokeIdx);
      const end = monster.name.slice(pokeIdx + pLen, MLen);

      return (
        <div key={idx}>
          <div
            className="row"
            onClick={() => {
              searchName(monster.name);
            }}
          >
            <p>{start}</p>
            <p className="highlighted">{pokemon}</p>
            <p>{end}</p>
          </div>
        </div>
      );
    });

    setProfile(monsterNames);
  };

  const searchName = (name) => {
    if (name.length === 0) return;

    fetch("/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `{getPokemon(str: "${name}") {name, image }}`,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        const pokemon = result.data.getPokemon;
        setMonster(pokemon);
        localStorage.setItem("pokemon", JSON.stringify(pokemon));

        setProfile(
          <div>
            <p>{pokemon.name}</p>
            <img src={pokemon.image} />
            <button
              onClick={() => {
                window.location.href = "/addLessons";
              }}
            >
              Login
            </button>
          </div>
        );
      });
  };

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input
        className="input"
        onKeyDown={(e) => {
          const name = e.target.value.toLowerCase();
          if (name.length < 2) return;
          setTimeout(() => {
            listNames(name);
          }, 2000);
        }}
      />
      <div className="container">{profile}</div>
    </div>
  );
};

ReactDOM.render(<Pokemon />, document.querySelector(".pokemon"));
