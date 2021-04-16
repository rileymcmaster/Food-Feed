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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.5);
  position: relative;
  background-color: black;
`;
const AvatarImg = styled.img`
  width: 100%;
  min-width: 50px;
  height: auto;
  min-height: 50px;
`;

export default AvatarImage;
