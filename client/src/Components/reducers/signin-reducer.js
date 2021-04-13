const initialState = {
  _id: "",
  userName: "",
  handle: "",
  email: "",
  password: "",
  isSignedIn: false,
};

export default function signin(state = initialState, action) {
  switch (action.type) {
    case "SIGN_IN":
      console.log("action", action);
      return {
        ...state,
        ...action.user,
        isSignedIn: true,
      };
    case "SIGN_OUT": {
      return {
        ...state,
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isSignedIn: false,
      };
    }
    default: {
      return state;
    }
  }
}
