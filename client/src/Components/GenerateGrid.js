import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import GridEach from "./GridEach";

const GenerateGrid = ({ items }) => {
  // console.log("items", items);
  //TODO: sort by popularity

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
  /* flex-basis: calc(calc(800px - 100%) * 999); */
  /* flex-grow: 2; */
  /* max-width: 100vw; */
  align-items: center;
  justify-content: center;
`;

export default GenerateGrid;
