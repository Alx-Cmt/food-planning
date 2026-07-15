import React from 'react'
import Home from './routes/Home'
import { BrowserRouter } from 'react-router'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import "../src/sass/main.scss"
import Recipes from './routes/Recipes'
import PlanningMaker from './routes/PlanningMaker'
import Grocery from './routes/Grocery'
import Recipedetail from './routes/Recipedetail'
import AddRecipe from './routes/AddRecipe'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/recipes' element={< Recipes/>} />
        <Route path='/planningmaker' element={< PlanningMaker/>} />
        <Route path='/grocery' element={<Grocery/>} />
        <Route path='/recipedetail/:documentId' element={<Recipedetail/>} />
        <Route path='/addrecipe' element={<AddRecipe/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App