export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    console.log(action.payload.followers);
    console.log(action.payload.following);
    return {
      ...state,
      following: action.payload.following,
      followers: action.payload.followers,
    };
  }
  if (action.type === "UPDATEIMAGE") {
    return {
      ...state,
      image: action.payload.image,
    };
  }
  return state;
};
