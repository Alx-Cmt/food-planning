import { Col } from 'antd'
import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import styles from "./Recipe.module.scss"
import { Link } from 'react-router'
//Import du hook draggable 

const Recipe = ({id, documentId, Name, Difficulty, action, inTheCart, editable, meal }) => {
        //On prepare ce qui va etre draggable 
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: meal?.id || meal?.documentId,
            //Chaine de fallback, ? = si meal.id n'existe pas, renvoi undefined, || = si la partie gauche est undefined ou NULL on essaie la droite

            //Identifiant unique du draggable
            data: { meal },
            //Les donnees attacher drag recuperable via active.data.current.meal
            disabled: !editable
            //Disabled = FONCTION PAR DEFAULT DE DND, si editable est false desactive completement le drag 
    })

    const style = transform ? {
    //Si transforme existe (l'element qui est entrain d'etre drag)
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        //on applique une transformation css pour que l'element suive la souris visuellement
    } : undefined

    return (
        <Col xs={20} sm={12} xl={8} xxl={4} ref={setNodeRef} style={style}>
            <div className={styles.recipe}>
                {/*ref={setNodeRef} = On dit a dnd que c'est cette element qui est draggable
                style={style} = On applique la transformation Css pendant le drag 
                */}
                {editable && (
                //Si editable est true alors =
                    <div {...listeners} {...attributes} style={{ cursor: 'grab' }}>
                        {/*
                        {...listeners} = les evenements qui declenche le drag sont appliquer juste acette div pour rendre le bouton toujours cliquable
                        {...attributes} = attributs d'accessibilité
                        style={{ cursor: 'grab' } = change le cursor en main quand la poignee est survoler 
                        */}
                        <div className={styles.grabthing}>
                            <i class="fa-solid fa-grip-vertical"></i>
                        </div>
                    </div>
                )}
                <Link className={styles.meal}to={`/recipedetail/${documentId}`}>
                    <div className={styles.name}>{Name}</div>
                    <div className={styles.difficulty} >{Difficulty}</div>
                </Link>
                <button className={styles.btn} onClick={action}>
                    {inTheCart ? <i class="fa-solid fa-xmark"></i> : <i class="fa-solid fa-plus"></i>}
                </button>
            </div>
        </Col>
    )
}

export default Recipe