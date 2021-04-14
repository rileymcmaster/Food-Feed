import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Wrapper from "./Wrapper";

const HomePage = () => {
  return (
    <>
      <Wrapper>
        <Container>
          <Title>FOOD FEED</Title>
          <Card>
            <StyledLink to={"/signin"}>Sign in</StyledLink>
            or
            <StyledLink to={"/signup"}>Sign up</StyledLink>
          </Card>
        </Container>
      </Wrapper>
    </>
  );
};
const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin-top: 5rem;
`;
const StyledLink = styled(Link)`
  text-decoration: none;

  padding: 10px;
  font-size: 2rem;
  background-color: lightblue;
  color: white;
  width: 150px;
  height: 60px;
  border: 5px white outset;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  vertical-align: center;
  &:hover {
    border: 5px white inset;
    font-size: 95%;
  }

  /* align-self: flex-start; */
`;
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
  /* margin: auto; */

  border: 2px solid black;
  padding: 20px;
  text-align: center;
  box-shadow: 2px 2px 0 black, 4px 4px 5px rgba(0, 0, 0, 0.5);
`;

export default HomePage;
