import React from 'react'
import Recipe from '../components/Recipe'
import styles from "./Recipe.module.scss"
import { Col, Row } from 'antd'

const Cart = ({items, action, actionvalidate}) => {
    
    const listItems = items.map(item => {
        return (
                <Recipe
                    key={item.id}
                    id={item.id}
                    Name={item.Name}
                    Difficulty={item.Difficulty}
                    inTheCart={item.inTheCart}
                    action={() => action(item)}
                />
        )
    })
  return (
    <div>
        <h2 className={styles.titres}>Plats Choisis</h2>
        <Row className={styles.list}gutter={[16, 16]}>
            {listItems}
        </Row>
        <button className={styles.btn} onClick={actionvalidate}><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  )
}

export default Cart