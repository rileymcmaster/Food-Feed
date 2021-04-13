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
`;
const AvatarImg = styled.img`
  width: 100%;
  height: auto;
`;

export default AvatarImage;
