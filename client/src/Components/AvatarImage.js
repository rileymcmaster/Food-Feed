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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  background-color: black;
`;
const AvatarImg = styled.img`
  width: 100%;
  height: auto;
`;

export default AvatarImage;
