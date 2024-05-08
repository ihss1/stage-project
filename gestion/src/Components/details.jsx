import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import CardStyle from '../Style/details.module.css';

export const UseApplianceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Get navigate function
  const [applianceDetails, setApplianceDetails] = useState(null);
  const [applianceLoading, setApplianceLoading] = useState(true);
  const [applianceError, setApplianceError] = useState(null);

  useEffect(() => {
    const fetchApplianceDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/appliance/${id}/client`);
        if (response.status === 200) {
          setApplianceDetails(response.data);
        } else {
          setApplianceError('Failed to fetch appliance data');
        }
      } catch (error) {
        setApplianceError('Error fetching appliance data:', error.message);
      } finally {
        setApplianceLoading(false);
      }
    };

    fetchApplianceDetails();
  }, [id]);

  useEffect(() => {
    if (applianceError) {
      window.alert("This appliance doesn't have a client");
      navigate('/appliance'); 
    }
  }, [applianceError, navigate]);

  return (
    <div className={CardStyle.container}>
      <p className={CardStyle['clnt-dtl']}> Client Details</p>
      {applianceDetails && (
        <div className={CardStyle.centeredTable}>
          <table className={CardStyle['profile-card']}>
            <tbody>
              <tr>
                <td className={CardStyle.labels}>nom</td>
                <td className={CardStyle.info}>{applianceDetails.nom}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>prenom</td>
                <td className={CardStyle.info}>{applianceDetails.prenom}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>activity</td>
                <td className={CardStyle.info}>{applianceDetails.activity}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>secteur</td>
                <td className={CardStyle.info}>{applianceDetails.secteur}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>fonction</td>
                <td className={CardStyle.info}>{applianceDetails.fonction}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>email</td>
                <td className={CardStyle.info}>{applianceDetails.email}</td>
              </tr>
              <tr>
                <td className={CardStyle.labels}>telephone</td>
                <td className={CardStyle.info}>{applianceDetails.telephone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
