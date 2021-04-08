import React from "react";
import styled from "styled-components";
import Wrapper from "./Wrapper";

const HomePage = () => {
  return (
    <Wrapper>
      <Title>HOMEPAGE</Title>
    </Wrapper>
  );
};

const Title = styled.div`
  font-size: 2rem;
  margin: auto;
`;

export default HomePage;
