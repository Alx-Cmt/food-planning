import React, { useEffect, useState } from 'react'
import Recipe from '../components/Recipe'
import { Row } from 'antd'
import { Link } from 'react-router'
import Cart from '../components/Cart'
import { useDispatch } from 'react-redux'
import { add, clear } from '../slices'
import Header from '../components/Header'
import styles from "../components/Recipe.module.scss"

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [cart, setCart] = useState({
    items: [],
  })
  const dispatch = useDispatch()

  const getRecipes = async () => {
    const json = await fetch(`${import.meta.env.VITE_API_URL}/api/meals?populate=ingredients`).then(response => response.json())
    setRecipes(json.data)
  }
  useEffect(() => {
    getRecipes()
  },[])

  const sendToPool = (item) => {
    dispatch(clear())
    cart.items.forEach(item => dispatch(add(item)))
    setCart({ items: [] })
  }

  const addToCart = (item) => {
        setCart({
            items: [...cart.items,{...item, inTheCart: true, id:`${item.documentId}-${Date.now()}`}]
        })
  }
  const removeFromCard = (item) => {
        setCart({
            items: cart.items.filter(cartItem => cartItem.id !== item.id)
        })
    }

  const listRecipes = recipes.map(item => {
    return (
        <Recipe
            key={item.documentId}
            documentId={item.documentId}
            id={item.id}
            Name={item.Name}
            meal={item}
            Difficulty={item.Difficulty}
            inTheCart={item.inTheCart}
            action={() => addToCart(item)}
        />
    )
  })

  return (
    <div>
      <Header/>
        <Row className={styles.listrecipes} gutter={[16,16]}>
            {listRecipes}
        </Row>
        <div className={styles.cart}>
          <Cart
              items={cart.items}
              action={removeFromCard}
              actionvalidate={() => sendToPool(cart.items)}
          />
        </div>
    </div>
  )
}

export default Recipes