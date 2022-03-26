//USER ACTIONS
export const signIn = (user) => ({
  type: "SIGN_IN",
  user,
});

export const signOut = (user) => ({
  type: "SIGN_OUT",
  user,
});

export const signUp = (user) => ({
  type: "SIGN_UP",
  user,
});

// RECIPES ACTIONS
export const fetchRecipe = () => ({
  type: "FETCH_RECIPE",
});
export const loadRecipe = (recipe) => ({
  type: "LOAD_RECIPE",
  recipe,
});
export const loadRecipeError = () => ({
  type: "LOAD_RECIPE_ERROR",
});
export const editRecipe = (recipe) => ({
  type: "EDIT_RECIPE",
  recipe,
});
export const toggleEdit = () => ({
  type: "TOGGLE_EDIT",
});
