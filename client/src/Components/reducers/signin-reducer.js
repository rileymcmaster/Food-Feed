const initialState = {
  _id: "",
  userName: "",
  handle: "",
  email: "",
  password: "",
  recipesCreated: [],
  deactivated: false,
  isSignedIn: false,
};

export default function signin(state = initialState, action) {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        ...action.user,
        isSignedIn: true,
      };
    case "SIGN_OUT": {
      return {
        ...state,
        _id: "",
        handle: "",
        userName: "",
        email: "",
        password: "",
        deactivated: false,
        recipesCreated: [],
        avatarUrl: "",
        bio: "",
        isSignedIn: false,
      };
    }
    default: {
      return state;
    }
  }
}
