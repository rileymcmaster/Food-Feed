import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AvatarImage from "./AvatarImage";
import moment from "moment";

const GridEach = ({ item }) => {
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

  return (
    !loading &&
    author && (
      <>
        {/* THE WHOLE CARD IS A LINK */}
        <StyledLink to={`/recipe/${item._id}`}>
          <ContainerEach>
            <ImageContainer>
              <Thumbnail src={item.recipeImageUrl} />
            </ImageContainer>
            <Name>{item.recipeName}</Name>
            {/* LINK TO AUTHOR PROFILE */}
            <AuthorLine>
              <UserLink to={`/user/${author._id}`}>
                <AvatarImage img={author.avatarUrl} />
                <Name>@{author.handle}</Name>
              </UserLink>
              <Date>
                <p>{moment(item.date).fromNow()}</p>
              </Date>
            </AuthorLine>
          </ContainerEach>
        </StyledLink>
      </>
    )
  );
};
const Date = styled.div`
  margin-left: auto;
  color: grey;
  vertical-align: bottom;
`;
const Name = styled.h2`
  /* margin-top: 10px; */
  font-size: 1.2rem;
`;
const UserLink = styled(Link)`
  margin-right: auto;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  min-width: 100px;
  height: 4rem;
  border-radius: 2rem;
  :hover {
    box-shadow: 0 0 0 2px black, 2px 2px 3px 1px rgba(0, 0, 0, 0.5);
  }
  :active {
    color: white;
    background-color: black;
    box-shadow: 0 0 4px 2px white inset, 0 0 2px black;
  }
`;

const AuthorLine = styled.div`
  width: 100%;
  /* display: block; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: auto;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;

const ImageContainer = styled.div`
  overflow: hidden;
  /* display: flex; */
  max-width: 300px;
  max-height: 300px;
  padding: 10px;
`;
const Thumbnail = styled.img`
  width: 100%;
  height: auto;
`;
const ContainerEach = styled.div`
  max-width: 400px;
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
