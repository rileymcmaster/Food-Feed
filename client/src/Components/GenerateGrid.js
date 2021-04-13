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
  align-items: center;
  justify-content: center;
`;

export default GenerateGrid;
