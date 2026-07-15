import React from 'react'
import { Link, useLocation } from "react-router"
import styles from "./Header.module.scss"
import { Col, Row } from 'antd'

const Header = ({ recipe }) => {

    const location = useLocation()

    const navigation = [
        {
            path:"/",
            icon: <i className="fa-solid fa-house"></i>
        },
        {
            path: "/recipes",
            icon: <i className="fa-solid fa-drumstick-bite"></i>
            
        },
        {
            path:"/grocery",
            icon: <i className="fa-solid fa-cart-shopping"></i>
        },
        {
            path:"/addrecipe",
            icon: <i className="fa-solid fa-plus"></i>
        },
        {
            path:"/planningmaker",
            icon: <i className="fa-solid fa-calendar-plus"></i>
        }
    ]
    const pageTitles = { 
        "/recipes": "Les recettes.", 
        "/addrecipe": "Ajouter une recette.", 
        "/grocery": "Les courses.", 
        "/": "Food planning.",
        "/planningmaker": "Crée le planning.",
    }

    let title = pageTitles[location.pathname]
    {/*pageTitles[location.pathname] = recherche dans l'objet pageTitles */}
    if (location.pathname.startsWith("/recipedetail")) {
        title = recipe.Name
    }

    return (
        <header>
            <Row className={styles.innerheader}>
                <Col>
                    <h1 className={styles.titre}> {title}</h1>
                    
                </Col>
                <Col className={styles.icons}>
                    {navigation.map((item) => {

                        if (location.pathname === item.path) {
                            return null
                        }

                        return (
                            <Link key={item.path} to={item.path}>
                                {item.icon}
                            </Link>
                        )
                    })}
                </Col>
            </Row>
        </header>
    )
}

export default Header