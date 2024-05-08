import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './Components/headeer';
import { UseApplianceDetails } from './Components/details';
import { Client } from './Components/client';
import { Pov } from './Components/povs';
import { Appliances } from './Components/applience';
import { UseClientDetails } from './Components/detailsClient';
import { PovSearch } from './Components/povSearch';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
           <Route path='/appliance' element={<Appliances />}  />
           <Route path='/details/:id' element={<UseApplianceDetails />} />
           <Route path='/client-details/:id' element={<UseClientDetails />} />
           <Route path='/client'    element={<Client />}      />
           <Route path='/pov'       element={<Pov />}          />
           <Route path='/pov-search' element={<PovSearch />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
