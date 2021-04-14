import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AvatarImage from "./AvatarImage";

const GridEach = ({ item }) => {
  //   console.log("item", item);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(`/user/${item.createdBy}`)
      .then((res) => res.json())
      .then((data) => setAuthor(data.data))
      .then(() => {
        setLoading(false);
      })
      .catch((err) => console.log("error", err));
  }, [item]);

  return loading && !author ? (
    <></>
  ) : (
    <>
      <StyledLink to={`/recipe/${item._id}`}>
        <ContainerEach>
          <ImageContainer>
            <Thumbnail src={item.recipeImageUrl} />
          </ImageContainer>
          <Name>{item.recipeName}</Name>
          {/* TO DO add link to user page */}
          <AuthorLine>
            <AvatarImage img={author.avatarUrl} />
            <Name>{author.handle}</Name>
          </AuthorLine>
        </ContainerEach>
      </StyledLink>
    </>
  );
};
const AuthorLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: auto;
`;
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
  width: 100%;
  height: auto;
  /* margin: auto; */
  /* margin-top: -300px; */
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
    /* transform: scale(1.01); */
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    filter: brightness(1.05);
  }
  &:active {
    /* transform: scale(0.99); */
    filter: brightness(0.95);
  }
`;
export default GridEach;
