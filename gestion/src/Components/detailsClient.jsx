import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import CardStyle from '../Style/details.module.css';
import FormStyle from '../Style/detailsClient.module.css';

export const UseClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [clientDetails, setClientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientLoading, setClientLoading] = useState(true);
    const [clientError, setClientError] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [nom, setNom] = useState('');
    const [clientsWithNoContact, setClientsWithNoContact] = useState([]);
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [fonction, setFonction] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/Client/${id}/Contact`);
                if (response.status === 200) {
                    setClientDetails(response.data.contact);
                } else {
                    setClientError('Failed to fetch client data');
                }
            } catch (error) {
                console.error('Error fetching client data:', error.message);
                setClientError('Error fetching client data:', error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchClientsWithNoContact = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/client/nocontact');
                if (response.status === 200) {
                    setClientsWithNoContact(response.data);
                } else {
                    setClientError('Failed to fetch clients with no contact');
                }
            } catch (error) {
                console.error('Error fetching clients with no contact:', error.message);
                setClientError('Error fetching clients with no contact:', error.message);
            } finally {
                setClientLoading(false);
            }
        };

        fetchClientDetails();
        fetchClientsWithNoContact();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                id_client: selectedClientId,
                nom,
                prenom,
                telephone,
                fonction,
                email
            };

            const response = await axios.post('http://127.0.0.1:8000/api/contact', formData);

            if (response.status === 200) {
                console.log('Form submitted successfully');
                navigate(`/client-details/${id}`);
                window.location.reload();
            } else {
                console.error('Failed to submit form data');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
    };

    if (loading || clientLoading) return <div>Loading...</div>;
    if (error || clientError) return <div>Error: {error || clientError}</div>;

    if (!clientDetails) {
        return (
            <div className={CardStyle.container}>
                <div className={FormStyle['form-popup']}>
                    <form onSubmit={handleFormSubmit} className={FormStyle.form}>
                        <select
                            value={selectedClientId}
                            onChange={handleClientChange}
                            className={FormStyle['form-input']}
                        >
                            <option value="">Select a client</option>
                            {clientsWithNoContact.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.libelle}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={nom}
                            placeholder='nom'
                            onChange={(e) => setNom(e.target.value)}
                            className={FormStyle['form-input']}
                        />

                        <input
                            type="text"
                            value={prenom}
                            placeholder='prenom'
                            onChange={(e) => setPrenom(e.target.value)}
                            className={FormStyle['form-input']}
                        />
                        <input
                            type="number"
                            value={telephone}
                            placeholder='num telephone'
                            onChange={(e) => setTelephone(e.target.value)}
                            className={FormStyle['form-input']}
                        />
                        <input
                            type="text"
                            value={fonction}
                            placeholder='fonction'
                            onChange={(e) => setFonction(e.target.value)}
                            className={FormStyle['form-input']}
                        />
                        <input
                            type="email"
                            value={email}
                            placeholder='email'
                            onChange={(e) => setEmail(e.target.value)}
                            className={FormStyle['form-input']}
                        />
                        <button
                            className={FormStyle['form-input']}

                            onClick={(e) => {
                                e.preventDefault();
                                handleFormSubmit(e)
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={CardStyle.container}>
                  <p className={CardStyle['clnt-dtl']}> Client Details</p>
            <div className={CardStyle.centeredTable}>
                <table className={CardStyle['profile-card']}>
                    
                    <tbody> 
                        <tr>
                            <td className={CardStyle.labels}>Nom</td>
                            <td className={CardStyle.info}>{clientDetails?.nom}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Prenom</td>
                            <td className={CardStyle.info}>{clientDetails?.prenom}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Activity</td>
                            <td className={CardStyle.info}>{clientDetails?.activity}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Secteur</td>
                            <td className={CardStyle.info}>{clientDetails?.secteur}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Fonction</td>
                            <td className={CardStyle.info}>{clientDetails?.fonction}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Email</td>
                            <td className={CardStyle.info}>{clientDetails?.email}</td>
                        </tr>
                        <tr>
                            <td className={CardStyle.labels}>Telephone</td>
                            <td className={CardStyle.info}>{clientDetails?.telephone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
