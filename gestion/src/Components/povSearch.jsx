import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchStyle from '../Style/povSearch.module.css'

export const PovSearch = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedClient = searchParams.get('id');

    const [searchedData, setSearchedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedClient) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/backup?client=${selectedClient}`);
                    setSearchedData(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedClient, location.search]);

    return (
        <div>
            <h2 className={SearchStyle.srch}>Searched Data for Client: <label className={SearchStyle.srchid}> {selectedClient} </label></h2>
            {loading ? (
                <p>Loading...</p>
            ) : searchedData.length === 0 ? (
                <p>No data found for the selected client.</p>
            ) : (
            <ul>
    {searchedData
        .filter(data => data.client === selectedClient) 
        .map((data) => (
            <div className={SearchStyle['profile-card']}>
                <li key={data.id}>
                    <strong>Libelle POV:</strong> {data.libelle_pov} <br />
                    <strong>Libelle Appliance:</strong> {data.libelle_appliance} <br />
                    <strong>Client:</strong> {data.client} <br />
                    <strong>Date Début:</strong> {data.dateDebut} <br />
                    <strong>Date Fin:</strong> {data.dateFin} <br />
                    <strong>Description:</strong> {data.description} <br />
                    <strong>Compte Manager:</strong> {data.compteManager} <br />
                    <strong>Ingenieur Cybersecurity:</strong> {data.ingenieurCybersecurity} <br />
                    <strong>Analyse Cybersecurity:</strong> {data.analyseCybersecurity}
                </li>
            </div>
        ))}
</ul>
            )}
        </div>
    );
};
