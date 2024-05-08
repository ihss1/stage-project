import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PovStyle from '../Style/pov.module.css';
import { Link } from 'react-router-dom';


export const Pov = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [libellePov, setLibellePov] = useState('');
    const [libelleAppliance, setLibelleAppliance] = useState('');
    const [clientOptions, setClientOptions] = useState([]);
    const [client, setClient] = useState('');
    const [applianceOptions, setApplianceOptions] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [compteManager, setCompteManager] = useState('');
    const [ingenieurCybersecurity, setIngenieurCybersecurity] = useState('');
    const [analyseCybersecurity, setAnalyseCybersecurity] = useState('');
    const [description, setDescription] = useState('');
    const [submittedDataList, setSubmittedDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [updatedData, setUpdatedData] = useState({});
    const [clients, setClients] = useState([]);
    const [appliances, setAppliances] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedAppliance, setSelectedAppliance] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredAppliances, setFilteredAppliances] = useState([]);
    const [blurBackground, setBlurBackground] = useState(false); 

    useEffect(() => {
        fetchData();
        fetchClientOptions();
        fetchApplianceOptions();
    }, []);


    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/backup')
          .then(response => {
            const data = response.data;
            const clientNames = Array.from(new Set(data.map(item => item.client)));
            setClients(clientNames);
            setAppliances(data);
          })
          .catch(error => console.error('Error fetching data:', error));
      }, []);
    
      useEffect(() => {
        if (selectedAppliance === '') {
          setFilteredClients(clients);
        } else {
          const filtered = appliances
            .filter(appliance => appliance.libelle_appliance === selectedAppliance)
            .map(appliance => appliance.client);
          setFilteredClients(Array.from(new Set(filtered)));
        }
      }, [selectedAppliance, appliances, clients]);
    
      useEffect(() => {
        if (selectedClient === '') {
          setFilteredAppliances(appliances);
        } else {
          const filtered = appliances.filter(appliance => appliance.client === selectedClient);
          setFilteredAppliances(filtered);
        }
      }, [selectedClient, appliances]);
    
      const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
      };
    
      const handleApplianceChange = (event) => {
        setSelectedAppliance(event.target.value);
      };
    
      
      const handleSearch = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/pov', {
                params: {
                    client: selectedClient,
                    appliance: selectedAppliance,
                },
            });
            if (response.status === 200) {
                setSubmittedDataList(response.data);
            } else {
                console.error('Failed to fetch filtered data');
            }
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };



    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/pov');
            if (response.status === 200) {
                setSubmittedDataList(response.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchClientOptions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/client');
            if (response.status === 200) {
                setClientOptions(response.data);
            } else {
                console.error('Failed to fetch client options');
            }
        } catch (error) {
            console.error('Error fetching client options:', error);
        }
    };

    const fetchApplianceOptions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/appliance');
            if (response.status === 200) {
                setApplianceOptions(response.data);
            } else {
                console.error('Failed to fetch appliance options');
            }
        } catch (error) {
            console.error('Error fetching appliance options:', error);
        }
    };

    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            libelle_pov: libellePov,
            id_appliance: libelleAppliance,
            id_client: client,
            dateDebut: formatDate(selectedStartDate),
            dateFin: formatDate(selectedEndDate),
            description: description,
            compteManager: compteManager,
            ingenieurCybersecurity: ingenieurCybersecurity,
            analyseCybersecurity: analyseCybersecurity,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/pov', data);
            if (response.status === 200) {
                setLibellePov('');
                setLibelleAppliance('');
                setClient('');
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                setCompteManager('');
                setIngenieurCybersecurity('');
                setAnalyseCybersecurity('');
                setDescription('');
                fetchData();
            } else {
                console.error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleEdit = (id) => {
        setSubmittedDataList((prevDataList) => {
            return prevDataList.map((item) => {
                if (item.id === id) {
                    return { ...item, isEditing: !item.isEditing };
                }
                return item;
            });
        });
    };

    const handleUpdate = (id, newData) => {
        const updatedDataCopy = { ...updatedData };
        if (newData.dateDebut) {
            newData.dateDebut = formatDate(newData.dateDebut);
        }
        if (newData.dateFin) {
            newData.dateFin = formatDate(newData.dateFin);
        }
        setUpdatedData((prevData) => ({
            ...prevData,
            [id]: { ...prevData[id], ...newData },
        }));
    };

    const handleSave = async (id) => {
        const confirmation = window.confirm('Are you sure you want to save these changes?');
        if (confirmation) {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/pov/${id}`, updatedData[id]);
                if (response.status === 200) {
                    fetchData();
                    setUpdatedData((prevData) => {
                        const updatedDataCopy = { ...prevData };
                        delete updatedDataCopy[id];
                        return updatedDataCopy;
                    });
                } else {
                    console.error('Failed to update data');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };

    const handleCancelEdit = (id) => {
        const newDataList = submittedDataList.map((item) => {
            if (item.id === id) {
                return { ...item, isEditing: false };
            }
            return item;
        });
        setSubmittedDataList(newDataList);
    };

    const handleDelete = async (id) => {
        const confirmation = window.confirm('Are you sure you want to delete this?');
        if (confirmation) {
            try {
                console.log(`Deleting item with ID: ${id}`);
                const response = await axios.delete(`http://127.0.0.1:8000/api/pov/${id}`);
                if (response.status === 200) {
                    fetchData();
                } else {
                    console.error('Failed to delete item');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const getClientNameById = (clientId) => {
        const client = clientOptions.find((client) => client.id === clientId);
        return client ? client.libelle : '';
    };

    const getApplianceNameById = (applianceId) => {
        const appliance = applianceOptions.find((appliance) => appliance.id === applianceId);
        return appliance ? appliance.libelle : '';
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = submittedDataList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
                <p className={PovStyle.Pov}>POV'S</p>
                <div className={PovStyle.searchForm}>
                <form action=""  className={PovStyle.form}>
                    <select 
                            onChange={handleClientChange} 
                            value={selectedClient}
                            className={PovStyle['form-input']}
                    >
                        <option value="">Select Client</option>
                    {filteredClients.map((client, index) => (
                    <option key={index} value={client}>{client}</option>
                    ))}
                    </select>
                    <select 
                            onChange={handleApplianceChange} 
                            value={selectedAppliance}
                            className={PovStyle['form-input']}
                    >
                        <option value="">Select Appliance</option>
                    {filteredAppliances.map((appliance, index) => (
                    <option key={index} value={appliance.libelle_appliance}>{appliance.libelle_appliance}</option>
                    ))}
                </select>
                <Link to={`/pov-search?id=${selectedClient}`}><button onClick={handleSearch}>Search</button></Link>
                </form>
                <button 
                         onClick={() => {
                            setShowPopup(true);
                            setBlurBackground(true);
                        }} 
                        className={PovStyle.addbtn}
                > 
                        Ajouter 
                </button>
                <div className={`${PovStyle.appl} ${blurBackground ? PovStyle['blur'] : ''}`}>
                </div>
            </div>
                        {showPopup && (
                            <div className={PovStyle['form-popup']}>
                        <form onSubmit={handleSubmit} className={PovStyle.form}>
                            <input
                                type="text"
                                placeholder="Libelle POV"
                                value={libellePov}
                                onChange={(e) => setLibellePov(e.target.value)}
                                className={PovStyle['form-input']}
                            />
                            <select
                                value={libelleAppliance}
                                onChange={(e) => setLibelleAppliance(e.target.value)}
                                className={PovStyle['form-input']}
                            >
                                <option value="">Select an appliance</option>
                                {applianceOptions
                                    .filter((appliance) => !submittedDataList.some((data) => data.id_appliance === appliance.id))
                                    .map((appliance) => (
                                        <option key={appliance.id} value={appliance.id}>
                                            {appliance.libelle}
                                        </option>
                                    ))}
                            </select>

                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className={PovStyle['form-input']}
                            >
                                <option value="">Select a client</option>
                                {clientOptions
                                    .filter((client) => !submittedDataList.some((data) => data.id_client === client.id))
                                    .map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.libelle}
                                        </option>
                                    ))}
                            </select>

                            <DatePicker
                                selected={selectedStartDate}
                                onChange={handleStartDateChange}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="Date debut"
                                className={`${PovStyle['form-input']} react-datepicker`}
                                showTimeInput={false}
                                onKeyDown={(e) => {
                                    if (!/\d/.test(e.key) && e.key !== 'Backspace') {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            <DatePicker
                                selected={selectedEndDate}
                                onChange={handleEndDateChange}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="Date fin"
                                className={`${PovStyle['form-input']} react-datepicker`}
                                showTimeInput={false}
                                onKeyDown={(e) => {
                                    if (!/\d/.test(e.key) && e.key !== 'Backspace') {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Compte Manager"
                                value={compteManager}
                                onChange={(e) => setCompteManager(e.target.value)}
                                className={PovStyle['form-input']}
                            />
                            <input
                                type="text"
                                placeholder="Ingenieur Cybersecurity"
                                value={ingenieurCybersecurity}
                                onChange={(e) => setIngenieurCybersecurity(e.target.value)}
                                className={PovStyle['form-input']}
                            />
                            <input
                                type="text"
                                placeholder="Analyse Cybersecurity"
                                value={analyseCybersecurity}
                                onChange={(e) => setAnalyseCybersecurity(e.target.value)}
                                className={PovStyle['form-input']}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={PovStyle['form-input']}
                            />
                            <button onClick={(e) => { 
                                                e.preventDefault(); 
                                                handleSubmit(e); 
                                                setShowPopup(false); 
                                                setBlurBackground(false);
                                                }}>
                                                    Submit
                            </button>
                        </form>
                        <button 
                                onClick={() => 
                                        {setShowPopup(false); 
                                        setBlurBackground(false);}}
                                className={PovStyle['close-btn']}
                        >   Close
                        </button>
                </div>
            )}

            {submittedDataList.length > 0 && (
                <div>
                    <table className={PovStyle['pov-responsive-table']}>
                        <thead className={PovStyle['table-header']}>
                            <tr>
                                <th className={PovStyle['col-1']}>Libelle POV</th>
                                <th className={PovStyle['col-2']}>Libelle Appliance</th>
                                <th className={PovStyle['col-3']}>Client</th>
                                <th className={PovStyle['col-4']}>Date Début</th>
                                <th className={PovStyle['col-5']}>Date Fin</th>
                                <th className={PovStyle['col-6']}>Description</th>
                                <th className={PovStyle['col-7']}>Compte Manager</th>
                                <th className={PovStyle['col-8']}>Ingenieur Cybersecurity</th>
                                <th className={PovStyle['col-9']}>Analyse Cybersecurity</th>
                                <th className={PovStyle['col-10']}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data) => (
                                <tr key={data.id} className={PovStyle['table-row']}>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={updatedData[data.id]?.libelle_pov || data.libelle_pov}
                                                onChange={(e) => handleUpdate(data.id, { libelle_pov: e.target.value })}
                                                className={PovStyle['edit-input']}
                                            />
                                        ) : (
                                            data.libelle_pov
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>{getApplianceNameById(data.id_appliance)}</td>
                                    <td className={PovStyle['col']}>{getClientNameById(data.id_client)}</td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <DatePicker
                                                selected={
                                                    updatedData[data.id]?.dateDebut
                                                        ? new Date(updatedData[data.id].dateDebut)
                                                        : data.dateDebut
                                                        ? new Date(data.dateDebut)
                                                        : null
                                                }
                                                onChange={(date) => handleUpdate(data.id, { dateDebut: date })}
                                                dateFormat="yyyy/MM/dd"
                                                className={`${PovStyle['edit-input']} react-datepicker`}
                                                showTimeInput={false}
                                            />
                                        ) : (
                                            data.dateDebut
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <DatePicker
                                                selected={
                                                    updatedData[data.id]?.dateFin
                                                        ? new Date(updatedData[data.id].dateFin)
                                                        : data.dateFin
                                                        ? new Date(data.dateFin)
                                                        : null
                                                }
                                                onChange={(date) => handleUpdate(data.id, { dateFin: date })}
                                                dateFormat="yyyy/MM/dd"
                                                className={`${PovStyle['edit-input']} react-datepicker`}
                                                showTimeInput={false}
                                            />
                                        ) : (
                                            data.dateFin
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={updatedData[data.id]?.description || data.description}
                                                onChange={(e) => handleUpdate(data.id, { description: e.target.value })}
                                                className={PovStyle['edit-input']}
                                            />
                                        ) : (
                                            data.description
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={updatedData[data.id]?.compteManager || data.compteManager}
                                                onChange={(e) => handleUpdate(data.id, { compteManager: e.target.value })}
                                                className={PovStyle['edit-input']}
                                            />
                                        ) : (
                                            data.compteManager
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={updatedData[data.id]?.ingenieurCybersecurity || data.ingenieurCybersecurity}
                                                onChange={(e) => handleUpdate(data.id, { ingenieurCybersecurity: e.target.value })}
                                                className={PovStyle['edit-input']}
                                            />
                                        ) : (
                                            data.ingenieurCybersecurity
                                        )}
                                    </td>
                                    <td className={PovStyle['col']}>
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={updatedData[data.id]?.analyseCybersecurity || data.analyseCybersecurity}
                                                onChange={(e) => handleUpdate(data.id, { analyseCybersecurity: e.target.value })}
                                                className={PovStyle['edit-input']}
                                            />
                                        ) : (
                                            data.analyseCybersecurity
                                        )}
                                    </td>
                                    <td>
                                        {data.isEditing ? (
                                            <div className={PovStyle['form-button-container']}>
                                                <button onClick={() => handleSave(data.id)} className={PovStyle['edit-input-btn']}>
                                                    Save
                                                </button>
                                                <button onClick={() => handleCancelEdit(data.id)} className={`${PovStyle['edit-input-btn']} ${PovStyle['delete-input-btn']}`}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(data.id)} className={PovStyle['edit-input-btn']}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(data.id)} className={`${PovStyle['edit-input-btn']} ${PovStyle['delete-input-btn']}`}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={PovStyle.pagination}>
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1 || currentItems.length === 0}>
                            Previous
                        </button>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pov;
