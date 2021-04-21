import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import GridEach from "./GridEach";

const GenerateGrid = ({ items }) => {
  return (
    <Container>
      {items.map((item) => {
        return <GridEach item={item} />;
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
`;

export default GenerateGrid;
