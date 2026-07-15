import React, { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Link } from 'react-router'
import { Checkbox, Col, Row } from 'antd'
import Header from '../components/Header'
import styles from "../components/Calendar.module.scss"

const Grocery = () => {
  const [monthlyMeals, setMonthlyMeals] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkedIds, setCheckedIds] = useState(() => {
    const saved = localStorage.getItem('checkedIngredients')
    //on stocke ce qui est dans le localStorage sous le nom de checkedIngredients
    return saved ? new Set(JSON.parse(saved)) : new Set()
    //si saved existe on transforme la string en tableau puis new set le convertit en set, si null on renvoie juste un set vide
    //Set = Structure de donnees de js comme un tableau 
})
  
    const getMonthlyMeals = async () => {
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

        const json = await fetch(`http://localhost:1337/api/calendars?populate[meal][populate]=ingredients&filters[date][$gte]=${start}&filters[date][$lte]=${end}`).then(response => response.json())
        setMonthlyMeals(json.data)
    }
    useEffect(() => {
        getMonthlyMeals()
    },[currentMonth])

    const nextMonth = () => {
        setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))
        setCheckedIds(new Set())
        localStorage.removeItem('checkedIngredients')
    }
  
  const prevMonth = () => {
        setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
        setCheckedIds(new Set())
        localStorage.removeItem('checkedIngredients')
    }

  const allIngredients = monthlyMeals.flatMap(item => item.meal.ingredients)
  //flatmap = permet de faire un tableau sans imbrication tout les elements sont au meme niveau
  //Dans l'exemple ci dessus on prend le tableau montlhyMeals on recupere tout les ingredient stocker dans l'imbrication meal pour les mettre dans allIngredients
  
  const ingredientCount = allIngredients.reduce((acc, ingredient) => {
    //reduce = prend un tableau et le reduit en une valeur
    //acc = la valeur qu'on construit au fur et a mesure
    //ingredient = l'element actuel du tableau
    if (acc[ingredient.documentId]) {
        //si acc d'un ingredient existe
        acc[ingredient.documentId].count += 1
        //alors on l'incremente
    } else {
        //sinon on creer l'acc d'un ingredient
        acc[ingredient.documentId] = {
            Name: ingredient.Name,
            count: 1,
            documentId: ingredient.documentId,
            checked : ingredient.Checked
        }
    }
    return acc
  }, {})

  const checked = (id, isChecked) => {
        setCheckedIds(prev => {
        // prev = valeur actuel de checkedIds au moment ou il est appeller (le set actuelle des id cochee)
            const newSet = new Set(prev)
            //on cree une copie du set actuel
            if (isChecked) {
                newSet.add(id)
            } else {
                newSet.delete(id)
            }
            localStorage.setItem('checkedIngredients', JSON.stringify([...newSet]))
            return newSet
        })
    }   
   
  const grocery = Object.values(ingredientCount).map(ingredient => {
    //Object.value = transforme un objet en tableau
    return (
        <Col xs={24} lg={12}>
            <div key={ingredient.documentId} className={checkedIds.has(ingredient.documentId) ? "check" : "noncheck"}>
                <input 
                    type="checkbox" 
                    checked={checkedIds.has(ingredient.documentId)}
                    onChange={(e) => checked(ingredient.documentId, e.target.checked)}
                />
                <label>x{ingredient.count} - {ingredient.Name}</label>
            </div>
        </Col>
    )
  })

    console.log(ingredientCount)
  return (
    <div>
        <Header/>
        <div className='month'>
            <div className={styles.calendarbtn}>
                <div className={styles.iconarrow} onClick={prevMonth}><i class="fa-solid fa-circle-chevron-left"></i></div>
                <h2>{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
                <div className={styles.iconarrow} onClick={nextMonth}><i class="fa-solid fa-circle-chevron-right"></i></div>
            </div>
        </div>
        <div className="items">
            <Row className="items-inner" gutter={[16, 16]}>
                {grocery}
            </Row>
        </div>
    </div>
  )
}
export default Grocery