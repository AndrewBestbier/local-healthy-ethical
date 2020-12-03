import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { auth, createUserProfileDocument } from "firebaseUtilities";

import { setCurrentUser } from "redux/user/user.actions";
import { fetchShopSettingsStartAsync } from "redux/shop/shop.actions";

// styles
import "assets/css/bootstrap.min.css";
import "assets/scss/paper-kit.scss?v=1.2.0";
import "assets/demo/demo.css?v=1.2.0";
// pages
import LoginModal from "components/LoginModal";
import NucleoIcons from "pages/NucleoIcons.js";
import LandingPage from "pages/LandingPage.js";
import ShopPage from "pages/ShopPage.js";
import CartPage from "pages/CartPage.js";
import CheckoutPage from "pages/CheckoutPage";
import RegisterPage from "pages/RegisterPage.js";
import AdminConsole from "pages/AdminConsole";
// others
import DemoFooter from "components/Footer.js";
import ExamplesNavbar from "components/Navbar.js";

const App = ({
  cart,
  currentUser,
  setCurrentUser,
  fetchShopSettingsStartAsync,
  shopSettings,
}) => {
  const [loginModal, setLoginModal] = useState(false);
  const [total, setTotal] = useState("0.00");

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        console.log("userAuth")
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        
        setCurrentUser(userAuth);
      }
    });

    return () => {
      unsubscribeFromAuth();
    };
  }, [setCurrentUser]);

  useEffect(() => {
    fetchShopSettingsStartAsync();
  }, [fetchShopSettingsStartAsync]);

  useEffect(() => {
    let cummulativeTotal = 0;
    cart.forEach((item) => {
      let price = Number(item.item.Price);
      let quantity = Number(item.quantity);
      let subTotal = price * quantity;
      cummulativeTotal += subTotal;
    });
    setTotal(cummulativeTotal.toFixed(2));
  }, [cart]);

  return (
    <div>
      <ExamplesNavbar setLoginModal={setLoginModal} />
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <Switch>
        <Route
          path="/nucleo-icons"
          render={(props) => <NucleoIcons {...props} />}
        />
        <Route exact path="/" render={(props) => <LandingPage {...props} />} />
        
        {shopSettings.shopIsLive && currentUser && currentUser.userAccepted && (
          <Route path="/shop" render={(props) => <ShopPage {...props} />} />
        )}
        <Route
          exact
          path="/cart"
          render={(props) => <CartPage {...props} total={total} />}
        />
        <Route
          path="/cart/checkout"
          render={(props) => <CheckoutPage {...props} total={total} />}
        />

        {/* {currentUser && currentUser.administrator && ( */}
          <Route
            path="/admin"
            render={(props) => <AdminConsole {...props} />}
          />
        {/* )} */}

        <Route
          path="/register"
          render={(props) => <RegisterPage {...props} />}
        />
        <Redirect to="/" />
      </Switch>
      <DemoFooter />
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cartItems,
  shopSettings: state.shop.shopSettings,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (userAuth) => dispatch(setCurrentUser(userAuth)),
  fetchShopSettingsStartAsync: () => dispatch(fetchShopSettingsStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
