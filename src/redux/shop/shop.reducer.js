import ShopActionTypes from "./shop.types";

const INITIAL_STATE = {
  shopData: [],
  isFetching: false,
  errorMessage: undefined,
  shopSettings: { shopIsLive: false, orderGroupName: "" },
  isFetchingSettings: false,
};

const shopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ShopActionTypes.FETCH_SHOP_SETTINGS_START:
      return {
        ...state,
        isFetchingSettings: true,
      };

    case ShopActionTypes.FETCH_SHOP_SETTINGS_SUCCESS:
      return {
        ...state,
        shopSettings: action.payload,
        isFetchingSettings: false,
      };

    case ShopActionTypes.FETCH_SHOP_SETTINGS_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
        isFetchingSettings: false,
      };

    case ShopActionTypes.FETCH_SHOP_DATA_START:
      return {
        ...state,
        isFetching: true,
      };
    case ShopActionTypes.FETCH_SHOP_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shopData: action.payload,
      };
    case ShopActionTypes.FETCH_SHOP_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default shopReducer;
