import React from "react";
import styled from "styled-components";

const Wrapper = ({ children }) => {
  return <WrapAll>{children}</WrapAll>;
};

const WrapAll = styled.div`
  height: 100vh;
  width: 100vw;
  padding: var(--page-vertical-padding) var(--page-horizontal-padding);
`;

export default Wrapper;
