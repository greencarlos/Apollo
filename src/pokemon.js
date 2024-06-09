import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import {
  ApolloClient,
  useLazyQuery,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

const SEARCH_QUERY = gql`
  query Query($str: String) {
    search(str: $str) {
      image
      name
    }
  }
`;

const POKEMON_QUERY = gql`
  query GetPokemon($str: String) {
    getPokemon(str: $str) {
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
  let timeoutId;
  const [profile, setProfile] = useState(<div></div>);
  const [monster, setMonster] = useState({
    name: "",
    image: null,
  });
  const [search, { loading, error, data }] = useLazyQuery(SEARCH_QUERY);
  const [getPokemon, { loadingPoke, errorPoke, dataPoke }] =
    useLazyQuery(POKEMON_QUERY);

  if (loadingPoke) return <h3>Loading...</h3>;
  if (errorPoke) return <h3>Error</h3>;

  const listNames = async (pokemon) => {
    const monster = await search({ variables: { str: pokemon } });
    const monsterName = monster.data.search[0].name;

    await setMonster({ name: monsterName });

    const listMonsters = monster.data.search.map(async ({ name }) => {
      return await getPokemon({ variables: { str: name } }).then(
        (res) => res.data.getPokemon
      );
    });

    const monsters = await Promise.all(listMonsters).then((res) => res);

    const monsterNames = monsters.map(({ name, image }, idx) => {
      const MLen = name.length;
      const pLen = pokemon.length;
      const pokeIdx = name.indexOf(pokemon);
      const start = name.slice(0, pokeIdx);
      const end = name.slice(pokeIdx + pLen, MLen);

      return (
        <div key={idx}>
          <div
            className="row"
            onClick={() => {
              searchName(name);
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

    const monster = await getPokemon({ variables: { str: name } }).then(
      (result) => {
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
      }
    );
  };

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input
        className="input"
        onKeyDown={(e) => {
          clearTimeout(timeoutId);
          const name = e.target.value.toLowerCase();
          if (name.length < 2) return;
          timeoutId = setTimeout(() => {
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
