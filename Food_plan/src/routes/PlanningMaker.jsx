import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Recipe from '../components/Recipe'
import { remove, add } from '../slices'
import { Link } from 'react-router'
import Calendar from '../components/Calendar';
import styles from "../components/Calendar.module.scss"
import { Col, Row } from 'antd'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DndContext } from '@dnd-kit/core'
import Header from '../components/Header'
import styles2 from "../components/Recipe.module.scss"

const PlanningMaker = () => {
    //Recuperation de state global avec useSelector
    const foodpool = useSelector(state => state.data.command)
    //Initialisation de dispatch pour modifier la state globale
    const dispatch = useDispatch()
    
    const [currentMonth, setCurrentMonth] = useState(new Date())
    // Creation d'un state pour accueillir les entries (plat du mois)
    const [entries, setEntries] = useState([])
    
    //Un bloc de code qui se lancera a chaque modification de currentMonth
    useEffect(() => {
        //On met le debut et la fin du mois dans des constantes avec un format different
        const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
        const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
        //Recuperation de toutes les entries du mois
        fetch(`${import.meta.env.VITE_API_URL}/api/calendars?populate=*&filters[date][$gte]=${start}&filters[date][$lte]=${end}`)
        //populate=* : Inclus toutes les relations (le meal lié a chaque entrée)
        //filters[date][$gte]=${start} : Juste les entre dont la date est superieure ou egale au current month
        .then(res => res.json())
        //Convertit en obj js

        //On stock les entries dans le tableau state entries
        .then(data => setEntries(data.data || []))
        //Recuperation du tableau (data) dans le res.json

    }, [currentMonth])

    //Preparation des boutons poour changer de mois
    const nextMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))
    const prevMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))

    //Appel au slice pour supprimer un meal
    const deleteMeal = (id) => {
        dispatch(remove(id))
    }

    const removeFromCalendar = async (meal, date, documentId) => {
        console.log('documentId reçu:', documentId)
        await fetch(`${import.meta.env.VITE_API_URL}/api/calendars/${documentId}`, {
            method: 'DELETE'
        })
        setEntries(prev => prev.filter(e => e.date !== date))

        dispatch(add({...meal, inTheCart: true, id: Date.now()}))
    }

    const handleDragEnd = async (event) => {
        //event = represente un rapport complet pendant le drag and drop il contient aussi tout les informations de l'objet drag
        //c'est dnd qui le cree automatiquement
        //Il recupere aussi useDraggable, useDroppable 

        const { active, over } = event
        //Destructuration de l'evenement dnd-kit
        //active = l'element qu'on a drague
        //over = la zone sur laquelle on a lacher

        // Si on drop en dehors d'une case, on ne fait rien
        if (!over) return

        const meal = active.data.current.meal
        // l'objet meal qu'on avait attaché dans useDraggable({ data: { meal } }) dans Recipe.jsx, il est importable car il se trouve dans l'event
        //active = l'element draguer
        //data = le data que j'ai passer a useDraggable
        //current = dnd enrobe toujours le data dans un current
        //meal = mon objet meal
        const date = over.id
        //La date de la case definie dans useDroppable({ id: date }), DroppableDay.jsx

        
        try {
        //try = si quelque chose est coupe dans le reseau on attrape l'erreur au lieu de tout faire planter
            dispatch(remove(meal.id))
            // Envoie de la date et du meal dans le calendar
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/calendars`, {
            //Lien vers l'envoi
                method: 'POST',
                //Methode d'envoie
                headers: { 'Content-Type': 'application/json' },
                //On dit a strapi de quel type de donnees il s'agit (JSON)
                body: JSON.stringify({
                //Le corps de la requete convertit en string JSON
                    data: {
                        date: date,
                        meal: meal.documentId
                    }
                })
            })
            const newEntry = await response.json()
            

            // Mise à jour du state local pour affichage immédiat sans refetch 
            setEntries(prev => [...prev, {
                id: newEntry.data.id,      
                documentId: newEntry.data.documentId,
                date: date,
                meal: meal
            }])

        } catch (error) {
            console.error('Erreur lors du drop:', error)
        }
    }

    const listfoodpool = foodpool.map((meal, index) => {
        return (
        <Recipe
            key={meal.id}
            id={meal.id}
            documentId={meal.documentId}
            Name={meal.Name}
            Difficulty={meal.Difficulty}
            inTheCart={meal.inTheCart}
            meal={meal}
            editable={true}
            action={() => deleteMeal(meal.id)}
        />
        )
    })
  return (
    <div>
    <Header/>
    <DndContext onDragEnd={handleDragEnd}>
    {/*DndContext = Le containeur parent de tout le drag and drop il englober les draggable et les droppable pour que dnd fasse le lien entre les deux*/}
        <div className={styles.calendarbtn}>
            <div className={styles.iconarrow} onClick={prevMonth}><i class="fa-solid fa-circle-chevron-left"></i></div>
            <h2>{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
            <div className={styles.iconarrow} onClick={nextMonth}><i class="fa-solid fa-circle-chevron-right"></i></div>
        </div>

        <Calendar 
            currentMonth={currentMonth}
            entries={entries}
            editable={true}
            onRemove={removeFromCalendar}
        />

        <div className={styles2.cart}>
            <h2 className={styles2.titres}>Plats Choisis</h2>
            <Row gutter={[16, 16]} className={styles2.list}>
                {listfoodpool}
            </Row>
        </div>
    </DndContext>
    </div>
  )
}

export default PlanningMaker