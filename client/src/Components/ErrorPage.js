import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "./Buttons/Button";

const ErrorPage = () => {
  return (
    <Container>
      <ErrorCard>
        <h1>This page can't be found.</h1>
        <StyledLink tabIndex="-1" to={"/recipes"}>
          <Button>GO HOME</Button>
        </StyledLink>
      </ErrorCard>
    </Container>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  margin-top: 30px;
  user-select: contain;
`;
const ErrorCard = styled.div`
  padding: 40px;
  border: 2px solid black;
  box-shadow: var(--recipe-box-shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    color: black;
    font-size: 2rem;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default ErrorPage;
