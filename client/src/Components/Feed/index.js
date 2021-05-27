import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import GridDisplay from "./GridDisplay";

import Wrapper from "../Wrapper";
import Loading from "../Loading";

const GridPage = () => {
  const user = useSelector((state) => state.user);

  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setErrorMessage("");
    setLoading(true);
    if (!user._id) {
      user._id = 0;
    }
    fetch(`https://food-feed.herokuapp.com/recipes/all/${user._id}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(({ status, data, message }) => {
        if (status === 200) {
          setItems(data);
        } else {
          setErrorMessage("There is an error");
        }
      })
      .catch((err) => {
        console.log("error", err);
        setErrorMessage("There is an error");
      });
    setLoading(false);
  }, [user]);

  return loading && !items ? (
    <Wrapper>
      <Loading />
    </Wrapper>
  ) : errorMessage && !items ? (
    <Container>
      <h1 style={{ margin: "auto" }}>There was an error. Try again later</h1>
    </Container>
  ) : items ? (
    <>
      <Container>
        <Title>FOOD FEED</Title>
        <GridDisplay items={items} />
      </Container>
    </>
  ) : (
    <></>
  );
};

const Container = styled.div`
  padding: 1em;
  display: flex;
  min-height: 90vh;
  flex-direction: column;
  margin-bottom: 20px;
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
