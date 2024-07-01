import { useUIContext } from '../context/index';

function useCart(product)
{
    const {cart, setCart} = useUIContext();
    //add additional functionality later
    const addToCart = (quantity) => {
       setCart(quantity);
    }

    const addToCartText = cart ? "Remove from cart" : "Add to cart";
    const resetCart = () => {
        setCart(0);
    }
    return { addToCart, addToCartText, resetCart }
}

export default useCart;