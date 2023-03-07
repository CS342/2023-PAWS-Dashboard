import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Dashboard from './Dashboard';
import ecgData from '../ecg.json';

function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);

    const { patient } = useParams();

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
        <Dashboard ecgdata={ecgData} />
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
                        <td>{ecg.effectivePeriod.start}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}

export default ECGList;