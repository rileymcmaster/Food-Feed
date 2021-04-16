import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GenerateGrid from "./GenerateGrid";
import Wrapper from "./Wrapper";

const GridPage = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  //load data
  useEffect(() => {
    setLoading(true);
    fetch(`/recipes/all`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data);
      })
      .catch((err) => {
        console.log("error", err);
        setErrorMessage("There is an error");
      });
    setLoading(false);
  }, [loading]);

  return loading && !items ? (
    <Wrapper>
      <h1>LOADING</h1>
    </Wrapper>
  ) : errorMessage && !items ? (
    <Wrapper>
      <h1>There was an error</h1>
    </Wrapper>
  ) : items ? (
    <>
      <Container>
        <Title>RECIPES</Title>
        <div style={{ marginTop: "1em" }}>
          <GenerateGrid items={items.reverse()} />
        </div>
      </Container>
    </>
  ) : (
    <></>
  );
};
const Container = styled.div`
  /* margin-top: 2em; */
  padding: 1em;
`;
const Title = styled.h1`
  text-align: center;
`;

export default GridPage;
