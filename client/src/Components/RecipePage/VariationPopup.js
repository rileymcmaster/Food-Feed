import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Motion, spring } from "react-motion";

const VariationPopup = ({ showVariations, variations, handleClick }) => {
  return (
    // showVariations && (
    <Motion
      defaultStyle={{ y: 200, opacity: 0, scale: 0 }}
      style={{
        y: spring(showVariations ? 0 : 200),
        opacity: spring(showVariations ? 1 : 0),
        scale: spring(showVariations ? 1 : 0),
      }}
    >
      {(style) => (
        <VariationCard
          style={{
            opacity: style.opacity,

            transform: `scaleY(${style.scale})`,
          }}
        >
          {variations.map((variation) => {
            return (
              <VariationLink
                to={`/recipe/${variation.variationId}`}
                onClick={handleClick}
                key={variation.variationId}
              >
                {variation.variationTitle}
                {variation.isOriginal && " (original)"}
              </VariationLink>
            );
          })}
        </VariationCard>
      )}
    </Motion>
  );
  //   );
};

const VariationCard = styled.div`
  padding: 20px 20px 60px 20px;
  border-radius: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 1);
  min-width: 200px;
  max-width: 600px;
  height: 80vh;
  overflow-y: auto;
`;

const VariationLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  padding: 5px;
  &::last-child {
    margin-bottom: 20px;
  }
  border-radius: 10px;
  &:hover {
    text-shadow: 0 0 5px white;
    box-shadow: 0 0 0 2px white;
  }
  &:active {
    color: black;
    background-color: white;
  }
`;

export default VariationPopup;
