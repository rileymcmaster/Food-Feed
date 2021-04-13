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
