import React, { useState, useEffect } from 'react';
import ApplienceStyle from '../Style/Appliances.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoIosAdd } from "react-icons/io";


export const Appliances = () => {
    const [libelle, setLibelle] = useState('');
    const [DBID, setDBID] = useState('');
    const [references, setReferences] = useState('');
    const [typeOptions, setTypeOptions] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [submittedDataList, setSubmittedDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [showForm, setShowForm] = useState(false); 
    const [blurBackground, setBlurBackground] = useState(false); 


    useEffect(() => {
        fetchData();
        fetchTypeOptions();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/appliance');
            if (response.status === 200) {
                setSubmittedDataList(response.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTypeOptions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/type');
            if (response.status === 200) {
                setTypeOptions(response.data);
            } else {
                console.error('Failed to fetch type options');
            }
        } catch (error) {
            console.error('Error fetching type options:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = submittedDataList.slice(indexOfFirstItem, indexOfLastItem);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            libelle,
            DBID,
            references,
            type_id: selectedTypeId
        };
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/appliance', data);
            if (response.status === 200) {
                setLibelle('');
                setDBID('');
                setReferences('');
                setSelectedTypeId('');
                fetchData(); // Fetch data again after successful submission
                setShowForm(false); // Close the form after submission
                setBlurBackground(false); // Remove the blur effect from the background
            } else {
                console.error('Failed to submit data');
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation error:', error.response.data);
            } else {
                console.error('Error submitting data:', error);
            }
        }
    };
    
    const handleEdit = (id) => {
        const newDataList = submittedDataList.map(item => {
            if (item.id === id) {
                return { ...item, isEditing: true };
            }
            return item;
        });
        setSubmittedDataList(newDataList);
    };

    const handleUpdate = async (id, newData) => {
        const confirmation = window.confirm('Are you sure you want to save these changes?');
        if (confirmation) {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/appliance/${id}`, newData);
                if (response.status === 200) {
                    fetchData(); // Fetch data again after successful update
                } else {
                    console.error('Failed to update data');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };

    const handleCancelEdit = (id) => {
        const newDataList = submittedDataList.map(item => {
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
            const response = await axios.delete(`http://127.0.0.1:8000/api/appliance/${id}`);
            if (response.status === 200) {
                fetchData(); // Fetch data again after successful deletion
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Delete it from the pov first');
        }
    }};
    
    

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className={ApplienceStyle['appl-container']}>
            <div className={ApplienceStyle.appl}>
             <p className={ApplienceStyle.appl}> Appliances </p>
            <div className={`${ApplienceStyle.appl} ${blurBackground ? ApplienceStyle['blur'] : ''}`}>
            </div>
                <IoIosAdd   
                    size={30}                 
                    onClick={() => {
                        setShowForm(true);
                        setBlurBackground(true);
                    }}
                    className={ApplienceStyle['add-button']}  />
            </div>

            {showForm && (
        <div className={ApplienceStyle['form-popup']}>
            <form onSubmit={handleSubmit} className={ApplienceStyle.form}>
            <input
                type="text"
                placeholder="libelle"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                maxLength={14}
                className={ApplienceStyle['form-input']}
            />
            <input
                type="text"
                placeholder="DBID"
                value={DBID}
                onChange={(e) => setDBID(e.target.value)}
                maxLength={14}
                className={ApplienceStyle['form-input']}
            />
            <input
                type="text"
                placeholder="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                maxLength={14}
                className={ApplienceStyle['form-input']}
            />
            <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className={ApplienceStyle['form-input']}
            >
                <option value="">Select Type</option>
                {typeOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.libelle}</option>
                ))}
            </select>
            <button  
                className={ApplienceStyle['form-button']} 
                onClick={(e) => { 
                    e.preventDefault(); 
                    handleSubmit(e); 
                    setShowForm(false); 
                    setBlurBackground(false);
                    }}>
                            Submit
                </button>
            <button  
                    onClick={() => 
                {setShowForm(false); 
                setBlurBackground(false);}} 
                className={ApplienceStyle['close-btn']}
                >Close</button>

        </form>
    </div>
)}


            {submittedDataList.length > 0 &&
                <div>
                    <table className={ApplienceStyle['appl-responsive-table']}>
                        <thead className={ApplienceStyle['table-header']}>
                            <tr>
                                <th className={ApplienceStyle['col-1']}>libellé</th>
                                <th className={ApplienceStyle['col-2']}>DBID</th>
                                <th className={ApplienceStyle['col-3']}>référence</th>
                                <th className={ApplienceStyle['col-4']}>type</th>
                                <th className={ApplienceStyle['col-5']}>historique</th>
                                <th className={ApplienceStyle['col-6']}>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index} className={ApplienceStyle['table-row']}>
                                    <td className={ApplienceStyle['col']} data-label="libelle:">
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={data.libelle}
                                                onChange={(e) => {
                                                    const newDataList = submittedDataList.map(item => {
                                                        if (item.id === data.id) {
                                                            return { ...item, libelle: e.target.value };
                                                        }
                                                        return item;
                                                    });
                                                    setSubmittedDataList(newDataList);
                                                }}
                                                className={ApplienceStyle['edit-input']}
                                            />
                                        ) : (
                                            data.libelle
                                        )}
                                    </td>
                                    <td className={ApplienceStyle['col']} data-label="DBID:">
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={data.DBID}
                                                onChange={(e) => {
                                                    const newDataList = submittedDataList.map(item => {
                                                        if (item.id === data.id) {
                                                            return { ...item, DBID: e.target.value };
                                                        }
                                                        return item;
                                                    });
                                                    setSubmittedDataList(newDataList);
                                                }}
                                                className={ApplienceStyle['edit-input']}
                                            />
                                        ) : (
                                            data.DBID
                                        )}
                                    </td>
                                    <td className={ApplienceStyle['col']} data-label="référence:">
                                        {data.isEditing ? (
                                            <input
                                                type="text"
                                                value={data.references}
                                                onChange={(e) => {
                                                    const newDataList = submittedDataList.map(item => {
                                                        if (item.id === data.id) {
                                                            return { ...item, references: e.target.value };
                                                        }
                                                        return item;
                                                    });
                                                    setSubmittedDataList(newDataList);
                                                }}
                                                className={ApplienceStyle['edit-input']}
                                            />
                                        ) : (
                                            data.references
                                        )}
                                    </td>
                                    <td className={ApplienceStyle['col']} data-label="type:">
                                        {data.isEditing ? (
                                            <select
                                                value={data.type_id}
                                                onChange={(e) => {
                                                    const newDataList = submittedDataList.map(item => {
                                                        if (item.id === data.id) {
                                                            return { ...item, type_id: e.target.value };
                                                        }
                                                        return item;
                                                    });
                                                    setSubmittedDataList(newDataList);
                                                }}
                                                className={ApplienceStyle['edit-input']}
                                            >
                                                <option value="">Select Type</option>
                                                {typeOptions.map(option => (
                                                    <option key={option.id} value={option.id}>{option.libelle}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            typeOptions.find(option => option.id === data.type_id)?.libelle || 'Unknown'
                                        )}
                                    </td>
                                    <td className={ApplienceStyle['col']} data-label="historique:">
                                        <Link to={`/details/${data.id}`} className={ApplienceStyle['link']}>details</Link>
                                    </td>
                                    <td className={ApplienceStyle['col']} data-label="action:">
                                        {data.isEditing ? (
                                            <div className={ApplienceStyle['form-button-container']}>
                                                <button onClick={() => handleUpdate(data.id, data)} className={ApplienceStyle['edit-input-btn']}>Save</button>
                                                <button onClick={() => handleCancelEdit(data.id)} className={`${ApplienceStyle['edit-input-btn']} ${ApplienceStyle['delete-input-btn']}`}>Cancel</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(data.id)}>Modifier</button>
                                                <button onClick={() => handleDelete(data.id)} className={`${ApplienceStyle['form-button']} ${ApplienceStyle['delete-input-btn']}`}>Supprimer</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={ApplienceStyle.pagination}>
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1 || currentItems.length === 0}>Previous</button>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentItems.length !== itemsPerPage}>Next</button>
                    </div>
                </div>
            }
        </div>
    );
};