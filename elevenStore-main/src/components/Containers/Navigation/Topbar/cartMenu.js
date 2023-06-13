import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "components/Button";
import { formatter } from "utils/useFormatter";

function CartMenu(props) {
  const { anchorElCart, isCartMenuOpen, handleCartMenuClose, setCartLength } = props;
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userUuid = user && user.uuid;
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!userUuid) return;

    const getCart = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_MY_API}/cart/${userUuid}?statusActive=true`);
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    getCart();

    if (isCartMenuOpen) {
      getCart();
    }
  }, [userUuid, isCartMenuOpen]);

  useEffect(() => {
    // Update the cart length whenever the cart changes
    setCartLength(cart.length);
  }, [cart, setCartLength]);

  return (
    <Menu
      anchorEl={anchorElCart}
      sx={{ top: "3rem" }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id="cart-menu"
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isCartMenuOpen}
      onClose={handleCartMenuClose}
    >
      <div className="py-1 px-4">{cart.length <= 0 ? <h1>Keranjang anda masih kosong, yuk belanja</h1> : <h1>Anda Memiliki {cart.length} items dikeranjang</h1>}</div>
      {cart.map((item) => (
        <MenuItem key={item.uuid} onClick={handleCartMenuClose}>
          <div className="flex items-center gap-2 text-sm">
            <img className="w-10 h-10" src={item.product.imageUrl} alt={item.product.nameProduct} />
            <h1>{item.product.nameProduct}</h1>
            <h1 className="text-blue-500">{formatter.format(item.product.price)}</h1>
          </div>
        </MenuItem>
      ))}
      <div className="py-2 px-4">
        {cart.length <= 0 ? null : (
          <Button
            onClick={() => {
              navigate("/cart");
              handleCartMenuClose();
            }}
            inputClassName="w-full justify-center"
            secondary
          >
            Tampilkan Keranjang Belanja
          </Button>
        )}
      </div>
    </Menu>
  );
}

export default CartMenu;
