import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import { Col, Row } from 'antd'

const Recipedetail = () => {
    //Recuperation de l'id dans l'url
    const { documentId } = useParams()
    const [recipe, setRecipe] = useState({ ingredients: [] })
    
    //Mise en place de l'appel API
    const getRecipe = async () => {
        const json = await fetch(`${import.meta.env.VITE_API_URL}/api/meals/${documentId}?populate=ingredients`).then(response => response.json())
        setRecipe(json.data)
    }
    //Lancement de l'appel API
    useEffect(() => {
        getRecipe()
    },[])

    const ingredientsList = recipe.ingredients.map(item => {
        return(
            <Col lg={24}>
                <span className='ingredient'>{item.Name}</span>
            </Col>
        )
    })

  return (
    <div>
        <Header
            recipe={recipe}
        />
        <div>
            <div>
                <h2 className='desc'>{recipe.Description}</h2>
            </div>
                <div className='listingredients'>
                    <div className="listingredients-inner">
                        <h2 className='title-list'>Liste des ingredients</h2>
                        <Row className='list' gutter={[16,16]}>
                            {ingredientsList}
                        </Row>
                    </div>
                </div>

                <div lg={9} className="recipe">
                    <span>{recipe.Recipe}</span>
                </div>
            
        </div>
    </div>
  )
}

export default Recipedetail