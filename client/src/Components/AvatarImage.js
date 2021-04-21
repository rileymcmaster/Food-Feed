import React from "react";
import styled from "styled-components";

const AvatarImage = ({ img }) => {
  return (
    <AvatarImgContainer>
      <AvatarImg src={img}></AvatarImg>
    </AvatarImgContainer>
  );
};

const AvatarImgContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;
  max-width: 50px;
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.5);
  background-color: black;
`;
const AvatarImg = styled.img`
  width: 100%;
  height: auto;
`;

export default AvatarImage;
