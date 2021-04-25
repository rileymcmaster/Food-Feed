import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import GridEach from "./GridEach";

import Wrapper from "../Wrapper";
import Loading from "../Loading";

const GridPage = () => {
  //USER STATE
  const user = useSelector((state) => state.user);

  const history = useHistory();
  //LOCAL STATES
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  //
  //load data
  useEffect(() => {
    setLoading(true);
    if (!user._id) {
      user._id = 0;
    }
    //SHORT DELAY TO WAIT IF THERE IS A USER LOGGED IN
    const delayFetch = setTimeout(() => {
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
    }, 1000);
    return () => clearTimeout(delayFetch);
  }, [user]);

  return loading && !items ? (
    <Wrapper>
      <Loading />
    </Wrapper>
  ) : errorMessage && !items ? (
    <Wrapper>
      <h1>There was an error</h1>
    </Wrapper>
  ) : items ? (
    <>
      <Container>
        <Title>FOOD FEED</Title>
        <GridContainer>
          {items.map((item) => {
            return <GridEach item={item} />;
          })}
        </GridContainer>
      </Container>
    </>
  ) : (
    <></>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-grow: 1;
  width: 80%;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
`;
const Container = styled.div`
  padding: 1em;
`;

const Title = styled.div`
  font-weight: bold;
  user-select: none;
  max-width: 300px;
  font-size: 1.5rem;
  border: 2px solid black;
  padding: 20px;
  margin: 2rem auto 0 auto;
  text-align: center;
  box-shadow: var(--recipe-box-shadow);
`;

export default GridPage;
