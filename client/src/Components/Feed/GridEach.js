import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import moment from "moment";
import AvatarImage from "../AvatarImage";
import Loading from "../Loading";
import {
  BsFillLockFill,
  BsFillUnlockFill,
  BsFillTrashFill,
} from "react-icons/bs";

// Render each preview recipe card in the feed and in user profile
// some alternate settings for a user viewing own profile - lock and delete buttons replace the author's picture and handle

const GridEach = ({ item }) => {
  const user = useSelector((state) => state.user);

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
    fetch(`https://food-feed.herokuapp.com/user/${item.createdBy}`)
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data.data);
        setLoading(false);
      })
      .catch((err) => console.log("error", err));
  }, [item]);

  const handleDeleteRecipe = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    if (user.isSignedIn && user._id === item.createdBy) {
      //DELETE RECIPE - sets isDelete to true
      // removes the recipe from the original recipe's variations array
      fetch(`https://food-feed.herokuapp.com/recipes/delete`, {
        method: "PATCH",
        body: JSON.stringify(item),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).catch((err) => console.log("error", err));
      //Update user's recipe array
      fetch(`https://food-feed.herokuapp.com/user/edit/remove`, {
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

  const handleChangePrivacy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const itemCopy = { ...item };
    itemCopy.isPrivate = !privacy;
    if (user.isSignedIn && user._id === item.createdBy) {
      fetch(`https://food-feed.herokuapp.com/recipes/privacy`, {
        method: "PATCH",
        body: JSON.stringify(itemCopy),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log("error  changing privacy setting", err));
    }
    setPrivacy(!privacy);
  };

  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "seconds",
      m: "1 min",
      mm: "%d mins",
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
                <AuthorLine>
                  <OptionIcon tabIndex="0">
                    {privacy ? (
                      <BsFillLockFill
                        size={30}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          handleChangePrivacy(e);
                        }}
                      />
                    ) : (
                      <BsFillUnlockFill
                        size={30}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          handleChangePrivacy(e);
                        }}
                      />
                    )}
                  </OptionIcon>
                  {/* DELETE BUTTON */}
                  {/* CAN'T DELETE ORIGINAL RECIPES, it messes up the variations array for future recipes */}
                  {!item.isOriginal && (
                    <OptionIcon tabIndex="0" style={{ marginLeft: "60px" }}>
                      <BsFillTrashFill
                        size={30}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          e.stopPropagation();
                          handleDeleteRecipe(e);
                        }}
                      />
                    </OptionIcon>
                  )}
                  <Date>
                    <p>{moment(item.date).fromNow()}</p>
                  </Date>
                </AuthorLine>
              </>
            ) : (
              // NORMAL VIEW
              // {/* LINK TO AUTHOR PROFILE */}
              <AuthorLine>
                <UserLink to={`/user/${author._id}`}>
                  <AvatarImage img={author.avatarUrl} />
                  <Name>
                    <p>{`${author.handle}`}</p>
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

const ContainerEach = styled.div`
  height: 400px;
  width: 300px;
  position: relative;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  color: black;
  border: 5px solid var(--accent-bg-color);
  :active {
    transform: translate(10px 10px);
  }
`;

const LoadingContainer = styled.div`
  height: 400px;
  width: 300px;
`;

const LinkContainer = styled(Link)`
  margin: 20px;
  text-decoration: none;
  user-select: none;
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

const OptionIcon = styled.div`
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
  right: 20px;
  color: grey;
  vertical-align: bottom;
  position: absolute;
`;

const Name = styled.div`
  h2 {
    /* margin-top: 10px; */
    width: 80%;
    text-align: center;
    margin: 10px auto 5px;
    font-size: 1.2rem;
  }
  p {
    margin-left: 0.2rem;
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
  height: 3rem;
  border-radius: 2rem;
  background-color: white;
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
  margin-top: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default GridEach;
