import React, { useEffect, useState } from 'react'
import styles from "../components/Calendar.module.scss"
import { format, startOfMonth, endOfMonth } from 'date-fns'
//Date-fns = librairie externe qui permet de manipuler les dates plus facilement
//startOfMonth, endOfMonth, startOfWeek, endOfWeek = Donne le premier ou dernier jour du mois ou de la semaine
//eachDayOfInterval = Genere un tableau de tout les jours entre 2 dates
//format = transforme un objet date en string lisible
//isSameMonth, isSameDay= Compare si 2 dates sont dans le meme mois ou jour
import { fr } from 'date-fns/locale';
import Calendar from '../components/Calendar';
import { Link } from 'react-router';
import Header from '../components/Header';
//'date-fns/locale' = Permet de passer le format de la date en francais


//Declaration du composant principal
const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  //Creation d'une state qui contiendra la date actuel
  const [entries, setEntries] = useState([]);
  //Creation d'une state qui contiendra la liste des repas recuperer par strapi

  useEffect(() => {
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
    //On calcul le debut et la fin du mois pour les utiliser dans l'URL lors de l'appel API

    fetch(`http://localhost:1337/api/calendars?populate=meal&filters[date][$gte]=${start}&filters[date][$lte]=${end}`)
      .then(res => res.json())
      .then(data => setEntries(data.data));
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(
    m => new Date(m.getFullYear(), m.getMonth() + 1, 1)
  );
  
  const prevMonth = () => setCurrentMonth(
    m => new Date(m.getFullYear(), m.getMonth() - 1, 1)
  );

  return (
    <div>
      <Header/>
      <div className={styles.calendarbtn}>
        <div className={styles.iconarrow} onClick={prevMonth}><i class="fa-solid fa-circle-chevron-left"></i></div>
        <h2>{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
        <div className={styles.iconarrow} onClick={nextMonth}><i class="fa-solid fa-circle-chevron-right"></i></div>
      </div>
      <Calendar 
        currentMonth={currentMonth} 
        entries={entries} 
        editable={false} 
      />
    </div>
  );
}


export default Home