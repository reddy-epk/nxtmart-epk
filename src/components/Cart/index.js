import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartItems: [],
    }
  }

  componentDidMount() {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || []
    this.setState({cartItems: storedCartItems})
  }

  removeAll = () => {
    localStorage.removeItem('cartItems')
    this.setState({cartItems: []})
  }

  handleIncrement = itemId => {
    const {cartItems} = this.state
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + 1,
        }
      }
      return item
    })

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
    this.setState({cartItems: updatedCartItems})
  }

  handleDecrement = itemId => {
    const {cartItems} = this.state
    const updatedCartItems = cartItems
      .map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          }
        }
        return item
      })
      .filter(item => item.quantity > 0)

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
    this.setState({cartItems: updatedCartItems})
  }

  calculateTotalPrice = () => {
    const {cartItems} = this.state
    return cartItems.reduce(
      (total, item) =>
        total + parseFloat(item.price.replace('₹', '')) * item.quantity,
      0,
    )
  }

  calculateTotalUniqueProducts = () => {
    const {cartItems} = this.state
    return cartItems.length
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {cartItems} = this.state
    /* eslint-disable */
    const noCart = () => {
      return (
        <div id="pk">
          <Header />
          <div className="cart-container">
            <img
              src="https://res.cloudinary.com/dqfqwre2q/image/upload/v1713688691/llogo-car_gg4zor.png"
              alt="empty cart"
              id="empty-logo"
            />
            <div className="empty-ness">
              <h1 className="empty">Your cart is empty</h1>
              <Link to="/" className="nav-home-link">
                Add Something
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Header />
        <div className="cartsy-container">
          {cartItems.length === 0 ? (
            noCart()
          ) : (
            <div id="if-cart-container">
              <div id="remove-section">
                <h1 id="cart-head">Items</h1>
                <button
                  type="button"
                  id="hyper-converter"
                  onClick={this.removeAll}
                >
                  Remove all
                </button>
              </div>

              <ul className="boxsy-container">
                {cartItems.map(item => (
                  <div>
                    <li key={item.id} id="cart-item">
                      <div className="imgandcontent">
                        <img
                          src={item.image}
                          alt={item.name}
                          id="sub-list-image"
                        />
                        <div id="content-box">
                          <p id="item-naam">{item.name}</p>
                          <p id="item-eight">{item.weight}</p>
                          <p id="item-rice">{item.price}</p>
                        </div>
                      </div>
                      <div className="item-quantity">
                        <button
                          type="button"
                          className="cart-dec"
                          onClick={() => this.handleDecrement(item.id)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-inc"
                          onClick={() => this.handleIncrement(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                    <hr />
                  </div>
                ))}
                <div id="priceandcheckout">
                  <div>
                    <p>
                      Total ({' '}
                      <span style={{color: 'red'}}>
                        {this.calculateTotalUniqueProducts()}{' '}
                      </span>{' '}
                      items ): ₹ {this.calculateTotalPrice().toFixed(2)}{' '}
                    </p>
                  </div>
                  <button type="button" id="checkout">
                    <Link to="/payment" id="checkout-card">
                      Check Out
                    </Link>
                  </button>
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Cart

/*
import React, {useState, useEffect} from 'react'
import './index.css'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || []
    setCartItems(storedCartItems)
  }, [])

  const removeAll = () => {
    localStorage.removeItem('cartItems')
    setCartItems([])
  }

  const handleIncrement = itemId => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          quantity: item.quantity + 1,
        }
        return updatedItem
      }
      return item
    })

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
    setCartItems(updatedCartItems)
  }

  const handleDecrement = itemId => {
    const updatedCartItems = cartItems
      .map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            quantity: item.quantity - 1,
          }
          return updatedItem
        }
        return item
      })
      .filter(item => item.quantity > 0)

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
    setCartItems(updatedCartItems)
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + parseFloat(item.price.replace('₹', '')) * item.quantity,
    0,
  )

  const totalProducts = cartItems.length

  return (
    <div>
      <button type="button" onClick={removeAll}>
        Remove all
      </button>
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} className="lk" />
              </div>
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-weight">{item.weight}</p>
                <p className="item-price">{item.price}</p>
              </div>
              <div className="item-quantity">
                <button
                  type="button"
                  className="decrement-button"
                  onClick={() => handleDecrement(item.id)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  type="button"
                  className="increment-button"
                  onClick={() => handleIncrement(item.id)}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
      <p>Total Unique Products: {totalProducts}</p>
    </div>
  )
}

export default Cart
*/
