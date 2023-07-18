import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [clients, setclients] = useState([]);
  const [selectedclient, setSelectedclient] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeZones, setTimeZones] = useState([]);

  useEffect(() => {
    const storedclients = JSON.parse(localStorage.getItem('clients'));
    if (storedclients) {
      setclients(storedclients);
    }
  }, []);

  useEffect(() => {
    if (selectedTimeZone !== '') {
      const interval = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString('en-US', {
          timeZone: selectedTimeZone,
        });
        setCurrentTime(currentTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedTimeZone]);

  useEffect(() => {
    axios
      .get('https://worldtimeapi.org/api/timezone')
      .then((response) => {
        const timeZones = response.data;
        setTimeZones(timeZones);
        setSelectedTimeZone(timeZones[0]); 
      })
      .catch((error) => {
        console.log('Error fetching time zones:', error);
      });
  }, []);

  const handleclientChange = (event) => {
    setSelectedclient(event.target.value);
  };

  const handleTimeZoneChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  const handleAddclient = () => {
    if (selectedclient !== '' && selectedTimeZone !== '') {
      const newclient = {
        name: selectedclient,
        timeZone: selectedTimeZone,
      };

      const updatedclients = [...clients, newclient];
      setclients(updatedclients);
      localStorage.setItem('clients', JSON.stringify(updatedclients));

      setSelectedclient('');
      setSelectedTimeZone('');
    }
  };

  const handleRemoveclient = (client) => {
    const updatedclients = clients.filter((m) => m !== client);
    setclients(updatedclients);
    localStorage.setItem('clients', JSON.stringify(updatedclients));
  };

  const calculateTimeDifference = (client) => {
    const myTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const clientTimeZone = client.timeZone;
    const myTime = new Date();
    const clientTime = new Date(
      myTime.toLocaleString('en-US', { timeZone: clientTimeZone })
    );
    const diff = (clientTime.getTime() - myTime.getTime()) / 1000; // Time difference in seconds
    const hoursDifference = Math.floor(diff / 3600);
   
    return `${hoursDifference}h `;
  };

  return (
    <div className="App w-[400px] bg-slate-800 min-h-screen text-gray-300">
      <h1 className=' text-2xl text-center py-2'>My Clients TimeZone</h1>
      <div className='berder p-2 space-y-2'>
        <div>
          <input type="text" className='bg-gray-700 p-1 rounded-sm w-full border border-gray-600' placeholder="Peson's Name" value={selectedclient} onChange={handleclientChange} />
        </div>
        <div>
          <select className='bg-gray-700 p-1 rounded-sm w-full border border-gray-600' value={selectedTimeZone} onChange={handleTimeZoneChange}>
            <option value="" disabled>
              Select a Time Zone
            </option>
            {timeZones.map((timeZone, index) => (
              <option key={index} value={timeZone}>
                {timeZone}
              </option>
            ))}
          </select>
        </div>
      <button onClick={handleAddclient} className='flex space-x-1 text-xl border border-gray-500 p-1 rounded-md content-center'>
      <span>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      </span>
     
      <span>
        Add 
      </span>
      </button>      
      </div>
          {clients.map((client, index) => (
            <div key={index} className='bg-gray-900 shadow-xl text-sm space-x-2 p-2 m-2 rounded-md items-baseline' >
              <p className=' text-center items-center'>
                <span className='text-xl'>{client.name}</span> -{" "}  
                <span className='text-xs'>{client.timeZone}</span>
              </p>
              <div className=" space-x-20  place-items-center text-center ">
              <span className="w-96">
                  {new Date().toLocaleTimeString('en-US', {
                    timeZone: client.timeZone,
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </span>
                <span>{calculateTimeDifference(client)} Diff</span>
                <span>
                  <button onClick={() => handleRemoveclient(client)} className=' bg-red-800 p-1 rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          ))}
        <a className='mx-20' href="https://ko-fi.com/youssefmahboub">
        <img className=' w-60 m-auto  ' src="https://storage.ko-fi.com/cdn/brandasset/kofi_button_stroke.png" alt="" />
        </a>
    </div>
  );
};


export default App;

