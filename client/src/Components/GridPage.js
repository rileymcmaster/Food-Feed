import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import GenerateGrid from "./GenerateGrid";
import Wrapper from "./Wrapper";
import Loading from "./Loading";

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
    // return !loading ? (
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
        <Title>The FEED</Title>
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
