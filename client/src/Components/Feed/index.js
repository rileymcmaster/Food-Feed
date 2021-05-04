import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import GridDisplay from "./GridDisplay";

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

  //load data
  useEffect(() => {
    setErrorMessage("");
    setLoading(true);
    const loadData = async () => {
      // let  checkIfLoggedIn =  await () => {
      if (!user._id) {
        user._id = 0;
      }

      // }
      //SHORT DELAY TO WAIT IF THERE IS A USER LOGGED IN
      // const delayFetch = setTimeout(() => {
      fetch(`https://food-feed.herokuapp.com/recipes/all/${user._id}`, {
        method: "GET",
        mode: "no-cors",
      })
        // fetch("https://food-feed.herokuapp.com/recipes/all/0", {
        //   mode: "cors",
        //   credentials: "include",
        // })
        // fetch(`/recipes/all/0`)
        .then((res) => {
          const response = res.json();
          console.log("response", response);
          return response;
        })
        .then(({ status, data, message }) => {
          console.log("status", status);
          console.log("message", message);
          console.log("data", data);
          setItems(data);
        })
        .catch((err) => {
          console.log("error", err);
          setErrorMessage("There is an error");
        });
      setLoading(false);
    };
    loadData();
    // }, 100);
    // return () => clearTimeout(delayFetch);
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
  width: 100vw;
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
