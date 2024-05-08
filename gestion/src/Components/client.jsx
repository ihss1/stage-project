import React, { useState, useEffect } from 'react';
import ClientStyle from '../Style/client.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";

export const Client = () => {
    const [libelle, setLibelle] = useState('');
    const [activite, setActivite] = useState('');
    const [secteur, setSecteur] = useState('');
    const [submittedDataList, setSubmittedDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(11);
    const [editableIndex, setEditableIndex] = useState(null);
    const [showForm, setShowForm] = useState(false); 
    const [editData, setEditData] = useState({ libelle: '', activite: '', secteur: '' });
    const [blurBackground, setBlurBackground] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null); 
    
    

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedClientId]);
    

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/client', {
                params: {
                    page: currentPage,
                    per_page: itemsPerPage
                }
            });
            if (response.status === 200) {
                setSubmittedDataList(response.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientData = {
            libelle,
            activite,
            secteur
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/client', clientData);
            if (response.status === 200) {
                fetchData();
                setLibelle('');
                setActivite('');
                setSecteur('');
                setShowForm(false);
                setBlurBackground(false); // Remove the blur effect from the background
            } else {
                console.error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
        setEditableIndex(null);
    };
    const handleEdit = (index, libelle, activite, secteur) => {
        setEditableIndex(index);
        setEditData({ libelle, activite, secteur });
    };

    const handleCancelEdit = () => {
        setEditableIndex(null);
    };

    const handleUpdate = async (id) => {
        const confirmation = window.confirm('Are you sure you want to save these changes?');
        if (confirmation) {
        try {
            console.log(editData)
            const response = await axios.put(`http://127.0.0.1:8000/api/client/${id}`, editData);
            if (response.status === 200) {
                fetchData();
                setEditableIndex(null);
            } else {
                console.error('Failed to update data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }};

    const handleDelete = async (id) => {
        const confirmation = window.confirm('Are you sure you want to delete?');
        if (confirmation) {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/client/${id}`);
            if (response.status === 200 || response.status === 204) {
                fetchData();
            } else {
                console.error('Failed to delete client');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Delete it from the pov first');
        }
    }};

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = submittedDataList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={ClientStyle['client-container']}>
            <div className={ClientStyle.client}>
            <p className={ClientStyle.client}> clients </p>
            <div className={`${ClientStyle.client} ${blurBackground ? ClientStyle['blur'] : ''}`}>
            </div>
                <IoIosAdd   
                    size={30}                 
                    onClick={() => {
                        setShowForm(true);
                        setBlurBackground(true);
                    }}
                    className={ClientStyle['add-button']}  />
            </div>
            {showForm && (
            <div className={ClientStyle['form-popup']}>
            <form onSubmit={handleSubmit} action="POST" method='POST' className={ClientStyle.form}>
                <input
                    type="text"
                    placeholder='nom de societe'
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    className={ClientStyle['form-input']}
                />
                <input
                    type="text"
                    placeholder='activite'
                    value={activite}
                    onChange={(e) => setActivite(e.target.value)}
                    className={ClientStyle['form-input']}
                />
                <select
                    value={secteur}
                    onChange={(e) => setSecteur(e.target.value)}
                    className={ClientStyle['form-input']}
                >
                    <option value=""> secteur </option>
                    <option value="Public">Public</option>
                    <option value="Prive">Prive</option>
                </select>
                <button 
                    className={ClientStyle['form-button']} 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        handleSubmit(e); 
                        setShowForm(false); 
                        setBlurBackground(false);
                        }}
                    >
    Submit
</button>
                <button  
                    onClick={() => 
                {setShowForm(false); 
                setBlurBackground(false);}}
                className={ClientStyle['close-btn']}
                >Close</button> 

                </form>
    </div>
)}
            {submittedDataList.length > 0 &&
                <div>
                    <table className={ClientStyle['client-responsive-table']}>
                        <thead className={ClientStyle['table-header']}>
                            <tr>
                                <th className={ClientStyle['col-1']}>nom</th>
                                <th className={ClientStyle['col-2']}>activite</th>
                                <th className={ClientStyle['col-3']}>secteur</th>
                                <th className={ClientStyle['col-4']}>historique</th>
                                <th className={ClientStyle['col-5']}>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((clientData, index) =>
                                <tr key={index} className={ClientStyle['table-row']}>
                                    <td className={ClientStyle['col']} data-label="nom:">
                                        {editableIndex === index ? (
                                            <input
                                                type="text"
                                                value={editData.libelle}
                                                                            onChange={(e) => setEditData({ ...editData, libelle: e.target.value })}
                                                className={ClientStyle['edit-input']}
                                            />
                                        ) : (
                                            clientData.libelle
                                        )}
                                    </td>
                                    <td className={ClientStyle['col']} data-label="activite:">
                                        {editableIndex === index ? (
                                            <input
                                                type="text"
                                                value={editData.activite}
                                                                            onChange={(e) => setEditData({ ...editData, activite: e.target.value })}
                                                className={ClientStyle['edit-input']}
                                            />
                                        ) : (
                                            clientData.activite
                                        )}
                                    </td>
                                    <td className={ClientStyle['col']} data-label="secteur:">
                                        {editableIndex === index ? (
                                            <select
                                                value={editData.secteur}
                                                onChange={(e) => setEditData({ ...editData, secteur: e.target.value })}
                                                className={ClientStyle['edit-input']}
                                            >
                                                <option value=""> secteur </option>
                                                <option value="Public">Public</option>
                                                <option value="Prive">Prive</option>
                                            </select>
                                        ) : (
                                            clientData.secteur
                                        )}
                                    </td>
                                    <td className={ClientStyle['col']} data-label="historique:">
                                    <Link to={`/client-details/${clientData.id}`} className={ClientStyle['link']}>details</Link>

                                    </td>

                                    <td className={ClientStyle['col']} data-label="action:">
                                        {editableIndex === index ? (
                                            <div className={ClientStyle['form-button-container']}>
                                                <button onClick={() => handleUpdate(clientData.id)} className={ClientStyle['edit-input-btn']}>Save</button>
                                                <button onClick={handleCancelEdit} className={`${ClientStyle['edit-input-btn']} ${ClientStyle['delete-input-btn']}`}>Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(index, clientData.libelle, clientData.activite, clientData.secteur)}>Edit</button>
                                                <button onClick={() => handleDelete(clientData.id)} className={`${ClientStyle['edit-input-btn']} ${ClientStyle['delete-input-btn']}`}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            }
            <div className={ClientStyle.pagination}>
                <button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <button 
                    onClick={() => handlePagination(currentPage + 1)} 
                    disabled={currentItems.length < itemsPerPage}
                >
                    Next
                </button>

            </div>
        </div>
    );
};

export default Client;
