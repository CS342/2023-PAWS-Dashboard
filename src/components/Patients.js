import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { Table, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function Patients() {
    const [patientList, setPatientList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const getPatients = async () => {
            setLoading(true);

            const ref = collection(db, "users")
            const querySnapshot = await getDocs(ref);
            const results = [];

            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });

            results.sort((a, b) => {
                if (a.lastName < b.lastName) {
                    return -1;
                }

                if (a.lastName > b.lastName) {
                    return 1;
                }

                return 0;
            })

            setPatientList(results);
            setLoading(false);
        }
        getPatients();
    }, [])

    return (
        !isAdmin ? 
            <h1>Only accessible to admins.</h1>
        :
        loading ?
            <h1>Loading ...</h1>
            :
            <>
                <h2>Select a patient</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientList.map((patient) => (
                            <tr>
                                <td>{patient.lastName}</td>
                                <td>{patient.firstName}</td>
                                <td>
                                    <Link to={`/ecglist/${patient.id}`} state={{ firstName: patient.firstName, lastName: patient.lastName }}>
                                        <Button aria-label="View Records">View Records</Button>
                                    </Link>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </Table>
            </>
    );
}

export default Patients;