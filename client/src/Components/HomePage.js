import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Wrapper from "./Wrapper";

const HomePage = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/recipes");
  };

  return (
    <>
      <Wrapper>
        <Container onClick={() => handleClick()}>
          <Title>HOMEPAGE</Title>
          <h2>Press anywhere</h2>
        </Container>
      </Wrapper>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Title = styled.div`
  font-size: 2rem;
  margin: auto;

  border: 2px solid black;
  padding: 20px;
  text-align: center;
`;

export default HomePage;
