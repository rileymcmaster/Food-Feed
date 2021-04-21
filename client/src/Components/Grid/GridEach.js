import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import AvatarImage from "../AvatarImage";
import moment from "moment";
import {
  BsFillLockFill,
  BsFillUnlockFill,
  BsFillTrashFill,
} from "react-icons/bs";
import Loading from "../Loading";

const GridEach = ({ item }) => {
  //USER STATE
  const user = useSelector((state) => state.user);
  //local states
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(null);
  const [deleteInProcess, setDeleteInProcess] = useState(false);
  const [privacy, setPrivacy] = useState(null);

  const urlId = useParams()._id;
  const history = useHistory();
  //fetch the author name and avatar
  useEffect(() => {
    setPrivacy(item.isPrivate);
    setDeleteInProcess(false);
    setLoading(true);
    fetch(`/user/${item.createdBy}`)
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data.data);
        setLoading(false);
      })
      .catch((err) => console.log("error", err));
  }, [item]);

  //DELETE RECIPE - only visible if the user is viewing their own profile page
  const handleDeleteRecipe = (e) => {
    setLoading(true);
    if (user.isSignedIn && user._id === item.createdBy) {
      //DELETE RECIPE
      fetch(`/recipes/delete`, {
        method: "DELETE",
        body: JSON.stringify(item),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("data", data));
      //Update user's recipe array
      fetch(`/user/edit/remove`, {
        method: "PATCH",
        body: JSON.stringify(item),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      });
      setLoading(false);
      setDeleteInProcess(true);
      history.go(0);
    }
  };
  // CHANGE PRIVACY SETTING
  const handleChangePrivacy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const itemCopy = { ...item };
    itemCopy.isPrivate = !privacy;
    if (user.isSignedIn && user._id === item.createdBy) {
      fetch(`/recipes/privacy`, {
        method: "PATCH",
        body: JSON.stringify(itemCopy),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("data", data));
    }
    setPrivacy(!privacy);
  };
  // Format for the timestamp
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "seconds",
      m: "1 minute",
      mm: "%d minutes",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      M: "1 month",
      MM: "%d months",
      y: "1 year",
      yy: "%d years",
    },
  });

  return loading ? (
    <LoadingContainer>
      <Loading />
    </LoadingContainer>
  ) : (
    !loading && author && (
      <>
        {/* THE WHOLE CARD IS A LINK */}
        <LinkContainer to={`/recipe/${item._id}`}>
          <ContainerEach>
            <ImageContainer>
              <Thumbnail src={item.recipeImageUrl} />
            </ImageContainer>
            <Name>
              <h2>{item.recipeName}</h2>
            </Name>
            {/* USER IS VIEWING OWN PROFILE */}
            {user._id === urlId ? (
              <>
                {/* PRIVACY */}
                <AuthorLine style={{ marginTop: "0px" }}>
                  <LockIcon
                    tabIndex="0"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleChangePrivacy(e);
                    }}
                    style={({ marginRight: "auto" }, { position: "absolute" })}
                  >
                    {privacy ? (
                      <BsFillLockFill size={30} />
                    ) : (
                      <BsFillUnlockFill size={30} />
                    )}
                  </LockIcon>
                  {/* DELETE BUTTON */}
                  <LockIcon tabIndex="0" style={{ margin: "0 auto" }}>
                    <BsFillTrashFill
                      size={30}
                      onClick={(e) => {
                        e.currentTarget.blur();
                        handleDeleteRecipe(e);
                      }}
                    />
                  </LockIcon>
                  <Date>
                    <p>{moment(item.date).fromNow()}</p>
                  </Date>
                </AuthorLine>
              </>
            ) : (
              // NORMAL VIEW - other users' recipes
              // {/* LINK TO AUTHOR PROFILE */}
              <AuthorLine>
                <UserLink to={`/user/${author._id}`}>
                  <AvatarImage img={author.avatarUrl} />
                  <Name>
                    <p> @{author.handle}</p>
                  </Name>
                </UserLink>
                {/* DATE */}
                <Date>
                  <p>{moment(item.date).fromNow()}</p>
                </Date>
              </AuthorLine>
            )}
          </ContainerEach>
        </LinkContainer>
      </>
    )
  );
};
const LoadingContainer = styled.div`
  min-width: 400px;
  margin-top: 80px;
`;
const LockIcon = styled.div`
  padding: 10px;
  border-radius: 50%;
  vertical-align: center;
  :hover {
    background-color: var(--primary-color);
    color: white;
  }
  :focus {
    background-color: var(--primary-color);
    color: white;
    outline: none;
  }
  :active {
    background-color: white;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
  }
`;
const Date = styled.div`
  margin-left: auto;
  /* max-width: 60px; */
  right: 20px;
  color: grey;
  vertical-align: bottom;
  position: absolute;
`;
const Name = styled.div`
  h2 {
    margin-top: 10px;
    font-size: 1.2rem;
  }
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
  &:hover {
    transition: 0.5s ease-out;
    box-shadow: 0 0 0 2px var(--primary-color),
      2px 2px 3px 1px rgba(0, 0, 0, 0.5), 5px 5px 5px 0 rgba(0, 0, 0, 0.2);
  }
  &:focus {
    outline: none;
    transition: 0.5s ease-out;
    box-shadow: 0 0 0 2px var(--primary-color),
      2px 2px 3px 1px rgba(0, 0, 0, 0.5), 5px 5px 5px 0 rgba(0, 0, 0, 0.2);
  }
  &:active {
    background-color: var(--primary-color);
    transition: none;
    box-shadow: 0 0 0 4px white, 0 0 0 8px var(--primary-color);
  }
`;

const AuthorLine = styled.div`
  width: 100%;
  margin-top: -10px;
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  margin-right: auto;
`;
const LinkContainer = styled(Link)`
  text-decoration: none;
  user-select: none;
  border: 2px solid var(--accent-bg-color);
  &:hover {
    transition: 0.5s ease-in-out;
    box-shadow: var(--recipe-box-shadow);
  }
  &:focus {
    transition: 0.5s ease-in-out;
    outline: none;
    box-shadow: var(--recipe-box-shadow);
  }
  :active {
    transition: 0.2s ease-out;
    transform: translate(10px, 10px);
    box-shadow: 0px 0px 0 0px black, 0 0 0px 0px rgba(0, 0, 0, 0.3);
  }
`;

const ImageContainer = styled.div`
  overflow: hidden;
  display: block;
  text-align: center;
  width: calc(100%);
  height: calc(90%);
  max-width: 300px;
  max-height: 300px;
  padding: 10px;
`;
const Thumbnail = styled.img`
  margin: auto 0;
  width: 100%;
  height: auto;
`;
const ContainerEach = styled.div`
  min-height: 400px;
  min-width: 300px;
  position: relative;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  color: black;
  :active {
    transform: translate(10px 10px);
  }
`;
export default GridEach;
