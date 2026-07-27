import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Select from 'react-select'
import Header from '../components/Header'
import { Col, Row } from 'antd'
//React-select utilise null a la place de ''

const AddRecipe = () => {
    //Mise en place de l'objet state recipe
    const[ingredients, setIngredients] = useState([])
    const[recipe, setRecipe] = useState({
        Name:"",
        Description:"",
        Recipe:"",
        Difficulty:"",
        ingredients:[],
    })
    //Creation d'un tableau vide par defaut
    const [selectedIngredients, setSelectedIngredients] = useState([null])

    //Ce bloc fait un appel API pour recuper tout les ingredients dispo et les mettre dans le states ingredients
    const getIngredients = async () => {
            const json = await fetch(`${import.meta.env.VITE_API_URL}/api/ingredients?pagination[limit]=200`).then(response => response.json())
            setIngredients(json.data)
    }
    useEffect(() => {
        getIngredients()
    },[])

    //Permet d'afficher tout les ingredients dans une liste et de les mettre sous forme de tableau dans ingredient option (map retourne auto un nouveau tableau)
    //[
    //  { value: 1, label: "Tomate" },
    //  { value: 2, label: "Oignon" }
    //]
    const ingredientOptions = ingredients.map(item => ({
        value: item.id,
        //La valeur relier a l'item dans la liste
        label: item.Name,
        //Le nom qui sera afficher dans la liste
    }))

    //Ce bloc sert a ajouter une entree vide dans le selectedingredient
    const addIngredient = () => {
        setSelectedIngredients([...selectedIngredients, null])
        //on creer un nouveau tableau ou on copie selectedIngredients et on ajoute une entree vide puis on le stocke avec setSelectedIngredients   
    }
    
    //Ce bloc sert a ajouter un ingredient dans selectedIngredient
    const changeIngredient = (index, value) => {
        const newIngredients = [...selectedIngredients]
        newIngredients[index] = value
        setSelectedIngredients(newIngredients)
    }

   //Mise en place d'une fonction pour changer le state en temps reel
   //Ce bloc de code se sert de key et value en param pour modifier setRecipe
   const changeInput = (key, value) => {
        setRecipe({
            ...recipe,
            //on derverse recipe
            [key]: value
            //et on modifie la valeur avec qui a [key] comme nom de propriete
            //*sans les [] autour de la key le nom de la propriete serait juste key
        })
   }

   //Ce bloc sert a envoyer les donnees a l'API 
    const submit = async (e) => {
        e.preventDefault()

        //On regarde si tout les champs sont rempli
        if (
            recipe.Name.trim() === "" ||
            recipe.Description.trim() === "" ||
            recipe.Recipe.trim() === "" ||
            recipe.Difficulty === "" ||
            selectedIngredients.length === 0
        ) {
            alert("Tous les champs sont obligatoires")
            return
        }

        await fetch(`${import.meta.env.VITE_API_URL}/api/meals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                //on combine les 2 states
                data: { 
                    ...recipe,
                    ingredients: selectedIngredients.filter(id => id !== null) 
                // on filtre les champs ingredient vides 
                } 
            })
        })
        
        //On remet les formulaires a zero
        setRecipe({
            Name:"",
            Description:"",
            Recipe:"",
            Difficulty:"",
            ingredients:[]
        })
        setSelectedIngredients([''])
        alert("Recette ajouté")
        return
    }

  return (
    <div>
        <Header/>
        <form onSubmit={(e) => submit(e)}>
            <Row className='fullfield'>
                <Col className='field' lg={12}>
                    <label className='labelform' htmlFor='Name'>Nom du plat : </label><br />
                    <input maxLength={30} id="Name" type='text' value={recipe.Name} onChange={(e) => changeInput("Name", e.target.value)}></input>
                </Col>
                <Col className='fielddifficulty' lg={12}>
                    <label className='labelform' htmlFor='Difficulty'>Difficulter : </label><br />
                    <select value={recipe.Difficulty} onChange={(e) => changeInput("Difficulty", e.target.value)}>
                        <option value="">Choisir...</option>
                        <option value="Facile">Facile</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Difficile">Difficile</option>
                    </select>
                </Col>
                <Col className='fieldwidth' lg={22}>
                    <label className='labelform' htmlFor='Recipe'>Recette : </label><br />
                    <textarea id="Recipe" rows={8} value={recipe.Recipe} onChange={(e) => changeInput("Recipe", e.target.value)}></textarea>
                </Col>
                <Col className='fieldwidth' lg={22}>
                    <label className='labelform' htmlFor='Description'>Description du plat : </label><br />
                    <textarea id="Description" rows={8} value={recipe.Description} onChange={(e) => changeInput("Description", e.target.value)}></textarea>
                </Col>
                <Col className='fieldwidth' lg={22}>
                    <label className='labelform' htmlFor='ingredients'>Ingredients :</label>
                    {selectedIngredients.map((ingredient, index) => (
                         <Select
                            key={index}
                            options={ingredientOptions}
                            isSearchable
                            value={
                                ingredient
                                    ? ingredientOptions.find(option => option.value === Number(ingredient))
                                    : null
                            }
                            onChange={(option) => changeIngredient(index, option ? option.value : null)}
                            placeholder="Choisir un ingrédient"
                            styles={{
                                singleValue: (base) => ({
                                    ...base,
                                    color: "rgb(58, 86, 53)",
                                    backgroundColor:"#f5eadc",
                                    fontFamily: 'league_gothicregular',
                                    fontSize: "1.2rem",
                                    textAlign: "left",
                                    padding:"0px",
                                }),
                                control: (base) => ({
                                    ...base,
                                    backgroundColor:"#f5eadc",
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#f3cd7a" : "#f5eadc",
                                    cursor: "pointer",
                                    fontFamily: 'league_gothicregular',
                                    fontSize: "1.2rem",
                                    color: "rgb(58, 86, 53)",
                                }),
                                    placeholder: (base) => ({
                                        ...base,
                                        textAlign: "left",
                                }),
                            }}
                        />
                    ))}
                    <button type="button" onClick={addIngredient}><i class="fa-solid fa-plus"></i></button>
                </Col>
                <Col lg={22}>
                    <input className='btnadd' type="submit" value="Ajouter"></input>
                </Col>
            </Row>
        </form>
    </div>
  )
}

export default AddRecipe