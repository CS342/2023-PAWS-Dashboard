import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import Table from 'react-bootstrap/Table';

function Patients() {
    const [patientList, setPatientList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getPatients = async () => {
            setLoading(true);

            const ref = collection(db, "users")
            const querySnapshot = await getDocs(ref);
            const results = [];

            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });

            setPatientList(results);
            setLoading(false);
        }
        getPatients();
    }, [])

    return (
        loading ?
            <h1>Loading ...</h1>
            :
            <>
            <h2>Select a patient</h2>
            <Table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>ID #</th>
                    </tr>
                </thead>
                <tbody>
                    {patientList.map((patient) => (
                        <tr>
                            <td>{patient.firstName}</td>
                            <td>{patient.lastName}</td>
                            <td><Link to={`/ecglist/${patient.id}`}>{patient.id}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </>
    );
}

export default Patients;