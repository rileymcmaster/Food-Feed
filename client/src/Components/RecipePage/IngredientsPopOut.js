import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
// components
import useMediaQuery from "../useMediaQuery";
import { editRecipe } from "../actions";
// icons
import { IoIosArrowDown } from "react-icons/io";
import { FaLink } from "react-icons/fa";

// currentRecipe,

const IngredientsPopOut = ({
  ingredients,
  toggleEdit,
  directionIndex,
  updatePageDirections,
}) => {
  const currentRecipe = useSelector((state) => state.recipe);
  const dispatch = useDispatch();
  // MEDIA QUERY - Break point is 800px
  let mediaQuery = useMediaQuery();

  const [open, setOpen] = useState(false);
  const [viewCheckboxes, setViewCheckboxes] = useState(false);

  const updateDirectionIngredient = (e, ingredientIndex, directionIndex) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.ingredients.filter((ingredient, index) => {
      if (
        ingredient.ingredient ===
        currentRecipeCopy.directions[directionIndex].ingredients[
          ingredientIndex
        ].ingredient
      ) {
        return (currentRecipeCopy.ingredients[index] = {
          ingredient: e.target.value,
        });
      }
    });
    //check if any other directions reference this ingredient
    currentRecipeCopy.directions.map((direction, i) => {
      direction.ingredients.filter((ingredient, idx) => {
        if (
          ingredient.ingredient ===
          currentRecipeCopy.directions[directionIndex].ingredients[
            ingredientIndex
          ].ingredient
        ) {
          direction.ingredients[idx] = { ingredient: e.target.value };
        }
      });
    });
    //change the value that is being edited
    currentRecipeCopy.directions[directionIndex].ingredients[ingredientIndex] =
      { ingredient: e.target.value };

    dispatch(editRecipe(currentRecipeCopy));
  };
  //if not editing or have the window expanded then you can't see the checkboxes
  useEffect(() => {
    if (!open || !toggleEdit) {
      setViewCheckboxes(false);
    }
    if (mediaQuery) {
      setOpen(true);
    }
  }, [open, toggleEdit, mediaQuery]);

  return (
    // IF NO INGREDIENTS TO SHOW - default to show nothing
    // IF NO ingredients but toggleEdit then show the chain icon and you can link ingredients
    ingredients.length <= 0 && !toggleEdit ? (
      <></>
    ) : ingredients.length <= 0 && toggleEdit && !open ? (
      <ViewCheckboxesAlt>
        <button
          onClick={() => {
            setViewCheckboxes(!viewCheckboxes);
            setOpen(true);
          }}
          type="button"
        >
          <FaLink size={20} />
        </button>
      </ViewCheckboxesAlt>
    ) : (
      // SHOW INGREDIENTS
      <Container onClick={() => !open && setOpen(true)} open={open}>
        {toggleEdit && open && (
          <ViewCheckboxes>
            <button
              onClick={() => setViewCheckboxes(!viewCheckboxes)}
              type="button"
            >
              <FaLink size={20} />
            </button>
          </ViewCheckboxes>
        )}
        {/* Click on title line to close */}
        <Title onClick={() => setOpen(!open)}>Ingredients in this step:</Title>
        <IngredientCard open={open} viewCheckboxes={viewCheckboxes}>
          <IngredientList>
            {ingredients.map((ingredient, ingredientIndex) => {
              return (
                <input
                  key={`${ingredientIndex}-${ingredient}`}
                  onChange={(e) =>
                    updateDirectionIngredient(
                      e,
                      ingredientIndex,
                      directionIndex
                    )
                  }
                  size="30"
                  type="text"
                  value={ingredient.ingredient}
                  disabled={!toggleEdit}
                />
              );
            })}
          </IngredientList>
          {/* CHECKBOXES */}
          <IngredientCheckboxes viewCheckboxes={viewCheckboxes}>
            {currentRecipe.ingredients.map((ingredient, ingredientIndex) => {
              let checkedIndex = currentRecipe.directions[
                directionIndex
              ].ingredients.findIndex(
                (ing) => ing.ingredient === ingredient.ingredient
              );
              return (
                <label
                  key={directionIndex + "-" + ingredient.ingredient}
                  htmlFor={directionIndex + "-" + ingredient.ingredient}
                >
                  <input
                    disabled={!toggleEdit}
                    checked={checkedIndex >= 0}
                    type="checkbox"
                    name="ingredient"
                    id={directionIndex + "-" + ingredient.ingredient}
                    name={directionIndex + "-" + ingredient.ingredient}
                    value={
                      currentRecipe.ingredients[ingredientIndex].ingredient
                    }
                    onChange={updatePageDirections}
                  />
                  {ingredient.ingredient}
                </label>
              );
            })}
          </IngredientCheckboxes>
        </IngredientCard>
        {/* OPEN/CLOSE BUTTON - mobile view only */}
        {!mediaQuery && (
          <Icon onClick={() => setOpen(!open)} open={open}>
            <IoIosArrowDown size={20} />
          </Icon>
        )}
      </Container>
    )
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  opacity: 0.8;
  transition: max-height 0.8s ease-in-out;
  max-height: ${(props) => (props.open ? "400px" : "100px")};
  background: ${(props) =>
    props.open
      ? ""
      : "  linear-gradient(0deg, rgba(172,172,172,0.9920343137254902) 0%, rgba(255,255,255,0) 19%) "};
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
`;

const ViewCheckboxes = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  button {
    display: flex;
    justify-content: center;
    padding: 5px;
    outline: none;
    background-color: black;
    border-radius: 20px;
    color: white;
    :active {
      background-color: white;
      color: black;
    }
  }
`;
const ViewCheckboxesAlt = styled(ViewCheckboxes)`
  right: 50%;
  transform: translate(50%, -30px);
`;

const Title = styled.div`
  font-size: 1.1rem;
  padding: 10px;
`;

const IngredientCard = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 200%;
  min-height: 200px;
  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    props.viewCheckboxes ? "translateX(-50%)" : "translateX(0%)"};
`;

const IngredientList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  padding-bottom: 1rem;
`;

const IngredientCheckboxes = styled.div`
  width: 100%;
  min-height: ${(props) => (props.viewCheckboxes ? "300px" : "100px")};
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;
const Icon = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 2px;
  border: ${(props) =>
    props.open ? "2px solid var(--primary-color)" : "none"};
  background-color: white;
  border-radius: 50%;
  transition: transform 0.8s cubic-bezier(0.89, -0.01, 0.68, 0.93);
  transform: translate(-50%, -0%)
    ${(props) => (props.open ? "rotate(0deg)" : "rotate(180deg)")};
  :hover {
    color: ${(props) => (props.open ? "white" : "black")};
    background-color: ${(props) =>
      props.open ? "var(--primary-color)" : "none"};
  }
`;

export default IngredientsPopOut;
