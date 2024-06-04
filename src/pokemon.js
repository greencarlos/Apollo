import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import {
  ApolloClient,
  useLazyQuery,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

const debounce = (func, delay) => {
  let debouceTimer
  return function() {
    const context = this
    const args = aguments
    clearTimeout(debouceTimer)
    debouceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

const FILES_QUERY = gql`
  query Lessons($str: String, $getPokemonStr2: String) {
    search(str: $str) {
      image
      name
    }
    getPokemon(str: $getPokemonStr2) {
      image
      name
    }
  }
`;

client.query({
  query: gql`
    query GetPokemon {
      lessons {
        title
      }
    }
  `,
});

const Pokemon = () => {
  const [profile, setProfile] = useState(<div></div>);
  const [monster, setMonster] = useState({
    name: "",
    image: null,
  });
  const [getPokemon, { loading, error, data }] = useLazyQuery(FILES_QUERY, {
    variables: { str: monster.name },
  });
  //const [searchPokemon, {loading, error, data}] = useMutation(FILES_QUERY)

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error</h3>;

  const listNames = async (pokemon) => {
    await setMonster({ name: pokemon });
    const data = await getPokemon(pokemon).then(res => res.data)

    const monsterNames = data.search.map((monster, idx) => {
      const MLen = monster.name.length;
      const pLen = pokemon.length;
      if (!monster.name.includes(pokemon)) return <></>;

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

    await setProfile(monsterNames);
  };

  const searchName = async (name) => {
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

const root = ReactDOM.createRoot(document.querySelector(".pokemon"));

root.render(
  <ApolloProvider client={client}>
    <Pokemon />
  </ApolloProvider>
);
