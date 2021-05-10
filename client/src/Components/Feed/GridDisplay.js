import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GridEach from "./GridEach";
import Pagination from "./Pagination";

const GridDisplay = ({ items }) => {
  const [currentPageItems, setCurrentPageItems] = useState(null);
  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //
  // PAGINATION - only show the range of items based on page
  useEffect(() => {
    if (items) {
      setCurrentPageItems(items.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [currentPageItems, currentPage]);
  return (
    currentPageItems && (
      <Container>
        <GridContainer>
          {currentPageItems.map((item) => {
            return <GridEach key={item.recipeName} item={item} />;
          })}
        </GridContainer>
        <Pagination
          items={items}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Container>
    )
  );
};
const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-grow: 1;
  width: 80%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;
const Container = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export default GridDisplay;
