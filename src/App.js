import './App.css';
import { BiCalendar } from "react-icons/bi"
import Search from './components/Search';
import AddAppointment from './components/AddAppointment';
import AppointmentInfo from './components/AppointmentInfo';
import { useCallback, useEffect, useState } from 'react';

function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState('petName');
  let [orderBy, setOrderBy] = useState('asc');
  const filteredAppointments = appointmentList.filter(item => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a, b) => {
    let order = (orderBy.toLowerCase() === 'asc') ? 1 : -1;
    return a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 * order : -1 * order;
  })
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App">
      <h1 className='text-5xl'><BiCalendar className='inline-block text-red-400 align-top' /> Your Appointment</h1>
      <AddAppointment onSendAppointment={myApponintment => setAppointmentList([...appointmentList, myApponintment])} lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)} />
      <Search query={query} onQueryChange={myQuery => setQuery(myQuery)}
        sortBy={sortBy} onSortByChange={(mySortBy) => setSortBy(mySortBy)}
        orderBy={orderBy} onOrderByChange={(myOrderBy) => setOrderBy(myOrderBy)}
      />
      <ul className='divide-y divide-hray-200'>
        {filteredAppointments.map(appointment => (
          <AppointmentInfo key={appointment.id} appointment={appointment}
            onDeleteAppointment={appointmentId => setAppointmentList(appointmentList.filter(appointment => appointment.id !== appointmentId))}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
