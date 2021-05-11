import React from "react";
import styled from "styled-components";

const Pagination = ({ items, itemsPerPage, currentPage, setCurrentPage }) => {
  // figure out length of items and create an array of all those numbers
  const totalItemLength = items.length;
  const totalNumOfPages = Math.ceil(totalItemLength / itemsPerPage);
  const totalPagesArray = [...Array(totalNumOfPages).keys()].map(
    (x, i) => i + 1
  );

  return (
    totalNumOfPages > 1 && (
      <Container>
        {totalPagesArray.map((page) => {
          return (
            <button
              id={page}
              className={page === currentPage && "active-page"}
              onClick={(e) => {
                window.scrollTo(0, 0);
                setCurrentPage(page);
                e.currentTarget.blur();
              }}
              type="button"
            >
              {page}
            </button>
          );
        })}
      </Container>
    )
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 auto 50px;
  & button {
    font-size: 1.2rem;
    border: none;
    background-color: white;
    box-shadow: 0 0 0 2px var(--primary-color);
    margin: 5px;
    height: 30px;
    width: 30px;
    :hover {
      transition: background-color 0.5s;
      background-color: var(--primary-color);
    }
    &.active-page,
    &:active {
      transition: all 0.5s;
      background-color: var(--accent-bg-color);
      color: white;
      box-shadow: 2px 2px 5px inset rgba(0, 0, 0, 0.5);
    }
    :focus {
      box-shadow: 2px 2px 5px inset rgba(0, 0, 0, 0.5);
      background-color: var(--primary-color);
    }
  }
`;

export default Pagination;
