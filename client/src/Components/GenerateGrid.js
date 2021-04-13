import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const GenerateGrid = ({ items }) => {
  // console.log("items", items);
  //TODO: sort by popularity

  return (
    <Container>
      {items.map((item) => {
        return (
          <StyledLink to={`/recipe/${item._id}`}>
            <ContainerEach>
              <ImageContainer>
                <Thumbnail src={item.recipeImage} />
              </ImageContainer>
              <Name>{item.recipeName}</Name>
            </ContainerEach>
          </StyledLink>
        );
      })}
    </Container>
  );
};
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const Name = styled.h2`
  margin-top: 10px;
`;
const ImageContainer = styled.div`
  overflow: hidden;
  width: 300px;
  height: 300px;
`;
const Thumbnail = styled.img`
  width: 500px;
  margin-top: -300px;
`;
const ContainerEach = styled.div`
  width: 400px;
  margin: 10px;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  color: black;
  transition: all 300ms;
  &:hover {
    transform: scale(1.01);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    filter: brightness(1.05);
  }
  &:active {
    transform: scale(0.99);
    filter: brightness(0.95);
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  /* flex-gap */
`;

export default GenerateGrid;
