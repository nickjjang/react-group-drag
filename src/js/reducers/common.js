import Types from '../actions/types';

export const initialState = {
  auth: null,
  orders: null
};

const login = (state, action) => ({
  ...state,
  auth: action.auth
});

const logout = state => ({
  ...state,
  auth: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN:
      return login(state, action);
    case Types.LOGOUT:
      return logout(state, action);
    case Types.ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};
