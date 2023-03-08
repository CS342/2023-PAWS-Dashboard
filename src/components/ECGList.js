import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Dashboard from './Dashboard';
import ecgData from '../ecg.json';

function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecgToDisplay, setEcgToDisplay] = useState(ecgData);

    const { patient } = useParams();

    const handleClick = (e) => {
        e.preventDefault();
        setEcgToDisplay(ecgData);
    }
    
    const dateToHumanReadable = (date) => {
        return new Date(date).toLocaleDateString(
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
            setLoading(false);
        }
        getEcgs();
    }, [])

    return (
        loading ?
        <h1>Loading ...</h1>
        :
        <>
        <Dashboard ecgdata={ecgToDisplay} />
        <br />
        <h2>Select an ECG to view</h2>
        <Table>
            <thead>
                <tr>
                    <th>ID #</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {ecgList.map((ecg) => (
                    <tr>
                        <td>{ecg.id}</td>
                        <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                        <td><Button onClick={handleClick}>View ECG</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}



export default ECGList;