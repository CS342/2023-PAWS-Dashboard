import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Dashboard from './Dashboard';
import { Container } from 'react-bootstrap';

function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecgToDisplay, setEcgToDisplay] = useState();

    const { patient } = useParams();

    const location = useLocation();
    const { firstName, lastName } = location.state

    const dateToHumanReadable = (date) => {
        const humanReadableDate = new Date(date).toLocaleDateString(
            'en-us',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'utc',
                hour: '2-digit',
                minute: '2-digit'
            }
        )
        return humanReadableDate;
    } 

    useEffect(() => {
        const getEcgs = async () => {
            setLoading(true);

            const ref = collection(db, "users", patient, "Observation")
            const querySnapshot = await getDocs(ref);
            const results = [];

            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });

            setEcgList(results);
            setEcgToDisplay(results[0]);
            setLoading(false);
        }
        getEcgs();
    }, [])

    return (
        loading ?
        <h1>Loading ...</h1>
        :
        <Container>
        <h1>{firstName} {lastName}</h1>
        <Dashboard ecgdata={ecgToDisplay} />
        <div style={{height: 300, overflowY: 'scroll'}}>
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Diagnosis</th>
                </tr>
            </thead>
            <tbody>
                {ecgList.map((ecg) => (
                    <tr className={(ecgToDisplay && ecgToDisplay.id) === ecg.id ? 'highlightedrow' : null}>
                        <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                        <td>{ecg.component[2].valueString}</td>
                        <td><Button onClick={() => setEcgToDisplay(ecg)}>View ECG</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
        </Container>
    );
}



export default ECGList;