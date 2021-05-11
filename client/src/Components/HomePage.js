import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import Button from "./Buttons/Button";
import Loading from "./Loading";

const HomePage = () => {
  const history = useHistory();
  //USER STATE
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.isSignedIn) {
      history.push("/recipes");
    }
  }, [user, history]);

  return user && user.isSignedIn ? (
    <Wrapper>
      <Loading />
    </Wrapper>
  ) : (
    <>
      <Wrapper>
        <Container>
          <Title>FOOD FEED</Title>
          <Card>
            <StyledLink to={"/signup"}>
              <Button>Sign up</Button>
            </StyledLink>
            <SignIn>
              Already a member? <StyledLink to={"/signin"}>Sign in</StyledLink>
            </SignIn>
          </Card>
        </Container>
      </Wrapper>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
`;
const Title = styled.div`
  user-select: none;
  font-size: 3rem;
  border: 2px solid black;
  padding: 20px;
  text-align: center;
  box-shadow: var(--recipe-box-shadow);
`;
const SignIn = styled.div`
  margin-top: 50px;
  font-size: 1.5rem;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin-top: 5rem;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  :last-child {
    text-decoration: underline;
  }
  font-size: 1.5rem;
`;

export default HomePage;
