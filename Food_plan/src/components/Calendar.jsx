  import React, { useEffect, useState } from 'react'
  import { Row, Col } from 'antd';
  import styles from "./Calendar.module.scss"
  import DroppableDay from './DroppableDay'
  import { 
    startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
    eachDayOfInterval, format, isSameMonth, isSameDay 
  } from 'date-fns'
  //Date-fns = librairie externe qui permet de manipuler les dates plus facilement
  //startOfMonth, endOfMonth, startOfWeek, endOfWeek = Donne le premier ou dernier jour du mois ou de la semaine
  //eachDayOfInterval = Genere un tableau de tout les jours entre 2 dates
  //format = transforme un objet date en string lisible
  //isSameMonth, isSameDay= Compare si 2 dates sont dans le meme mois ou jour
  import { fr } from 'date-fns/locale';
  import { Link } from 'react-router';
  //'date-fns/locale' = Permet de passer le format de la date en francais

  //Preparation du calendrier
  function generateMonthGrid(currentMonth) {
    //Prend pour parametre le mois actuel
    const monthStart = startOfMonth(currentMonth);
    //Calcule le premier jour du mois
    const monthEnd = endOfMonth(currentMonth);
    //Calcule le dernier jour du mois
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    //On fait en sorte que le tableau commence toujours un lundi
    //weekStartsOn: 1 = precise que la semaine commence un lundi (1) 
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    //Meme principe, on fait finir le tableau le dimanche meme si le mois deborde

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
    //Genere un tableau avec toute les dates en entre start et end
  }

  function Calendar({ currentMonth, entries, editable, onRemove }) {
    //({}) = Syntaxe de destructuration, le composant recoit 1 props, mais au lieu d'ecrire props.currentMonth, props.entries etc..., on prend directement les 3 proprietes
    const days = generateMonthGrid(currentMonth);
    //On appelle la fonction creer plus haut toujours avec pour parametre le mois actuel
    //Cela nous retourne le tableau du mois

    const entriesByDate = {};
    //Pour chaque element de tableau entries(state)
    entries.forEach(entry => {
      //on va initialiser une cle qui prendra la date de l'entry comme nom pour pouvoir afficher les repas plus facilement
      entriesByDate[entry.date] = entry;
    });


    return (
      <div className={styles.calendar}>
        {/*Creation d'un tableau avec pour chaque itération (tout les jours de la semaines)*/}
        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => (
          //.map pour effectuer une action sur chaque iterations
          <div className={styles.day} key={d}>{d}</div>
          //Pour chaque iteration creation d'une div avec pour nom le nom de l'iteration
        ))}

        {days.map(day => {
          //On reprend days, le tableau generer par generateMonthGrid
          //Puis on fait .map (contrairement au .map precedent, on utilise des {} au lieu de () car plusieurs ligne avant de faire le return)
          const dateKey = format(day, 'yyyy-MM-dd');
          //Pour chaque day(iteration du map) on le transforme en string (ex = 2005/12/30)
          const entry = entriesByDate[dateKey];

          const inCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div>
            <DroppableDay key={dateKey} date={dateKey}>
                <div className={styles.daynumber}>{format(day, 'd')}</div>
                {entry?.meal && (
                    <div className={styles.test}>
                      <Link to={`/recipedetail/${entry.meal.documentId}`}>
                        <div className={styles.mealname}>{entry.meal.Name}</div>
                      </Link>
                      {editable && (
                        <div className={styles.btn} onClick={() => onRemove(entry.meal, entry.date, entry.documentId)}><i class="fa-solid fa-xmark"></i></div>
                      )}
                  </div>     
                )}
            </DroppableDay>
            </div>
          );
        })}
      </div>
    );
  }

  export default Calendar
