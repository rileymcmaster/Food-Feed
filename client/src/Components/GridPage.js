import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import GenerateGrid from "./GenerateGrid";
import Wrapper from "./Wrapper";

const GridPage = () => {
  //USER STATE
  const user = useSelector((state) => state.user);

  //LOCAL STATES
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  //
  //load data
  useEffect(() => {
    // console.log("start fetch");
    setLoading(true);
    console.log("user_id", user._id);

    if (!user._id) {
      user._id = 0;
    }
    fetch(`/recipes/all/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data);
      })
      .catch((err) => {
        console.log("error", err);
        setErrorMessage("There is an error");
      });
    setLoading(false);
  }, [user]);

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
          <GenerateGrid items={items} />
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
