import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import styles from "./Calendar.module.scss"
//Import du hook useDroppable 

//Declaration du composant avec 2 props
const DroppableDay = ({ date, children }) => {
    //date = la date au format '2026-07-05'
    //children = tout ce qui est mis entre les balises <DropableDay>

    const { setNodeRef, isOver } = useDroppable({
        //on appelle useDroppable en lui donnant un id (ici la date de la case)
        //setNodeRed = reference a attacher a l'element DOM pour que dnd sache qu'elle zone est droppable
        //isOver = bool qui vaut true uniquement quand un element drague est au dessus de cette case en ce moment
        id: date,
    })

    return (
        <div className={styles.hovered}
            //on attache setNodeRef a la div pour qu'il la "surveille"
            ref={setNodeRef}
            className={`${styles.droppableday} ${isOver ? styles.isover : ''}`}
        >
            {children}
        </div>
    )
}

export default DroppableDay