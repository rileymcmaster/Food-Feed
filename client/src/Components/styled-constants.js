import styled from "styled-components";

export const Container = styled.section`
  transition: filter 1s ease;
  filter: ${(props) => (props.confirmSendRecipe ? "blur(5px)" : "")};
  background: rgb(238, 238, 238);
  background: linear-gradient(
    0deg,
    rgba(238, 238, 238, 1) 0%,
    rgba(241, 241, 241, 0) 13%,
    rgba(255, 255, 255, 0) 84%,
    rgba(238, 238, 238, 1) 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
  z-index: 0;
  input,
  textarea {
    background-color: transparent;
    font-size: 1rem;
    text-align: left;
    size: 100%;
    outline: none;
    border: none;
    box-shadow: none;
    color: black;
  }
  textarea:disabled,
  input:disabled {
    color: black;
    opacity: 1;
  }
  input:focus-within,
  textarea:focus-within {
    border-bottom: 2px solid blue;
    outline: none;
    box-shadow: 0 1px 2px blue;
  }
  input:focus,
  textarea:focus-within {
    border-bottom: 2px solid blue;
    outline: none;
  }
`;
