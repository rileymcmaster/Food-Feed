const initialState = {
  loading: false,
  error: false,
  _id: "",
  recipeName: "",
  ingredients: [],
  directions: [],
  likedBy: [],
  isOriginal: true,
  originalRecipe: "",
  createdBy: "",
  variations: [],
  isPrivate: false,
  isDeleted: false,
  recipeImageUrl: "",
  date: "",
};

export default function currentRecipe(state = initialState, action) {
  switch (action.type) {
    case "FETCH_RECIPE": {
      return {
        ...initialState,
        loading: true,
      };
    }
    case "LOAD_RECIPE": {
      return {
        ...state,
        loading: false,
        error: false,
        _id: action.recipe._id,
        recipeName: action.recipe.recipeName,
        ingredients: action.recipe.ingredients,
        directions: action.recipe.directions,
        likedBy: action.recipe.likeBy,
        isOriginal: action.recipe.isOriginal,
        originalRecipe: action.recipe.originalRecipe,
        createdBy: action.recipe.createdBy,
        variations: action.recipe.variations,
        isPrivate: action.recipe.isPrivate,
        isDeleted: action.recipe.isDeleted,
        recipeImageUrl: action.recipe.recipeImageUrl,
        date: action.recipe.date,
      };
    }
    case "LOAD_RECIPE_ERROR": {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case "EDIT_RECIPE": {
      // TO DO
      return action.recipe;
    }
    default: {
      return state;
    }
  }
}
