import { useState, useEffect } from 'react';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams, useLocation } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Dashboard from '../Dashboard';
import { Container } from 'react-bootstrap';
import {  Button } from '@mui/material';

export default function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecgToDisplay, setEcgToDisplay] = useState();
    const { patient} = useParams();
    const location = useLocation();
    const {state} = location;
    const [names, setNames] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [qualities, setQualities] = useState([]);

    const dateToHumanReadable = (date) => {
        const humanReadableDate = new Date(date).toLocaleDateString(
            'en-us',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: '2-digit',
                minute: '2-digit'
            }
        )
        return humanReadableDate;
    }

    const handleInputChange = (index, value) => {
        const updatedRows = [...names];
        updatedRows[index] = value;
        setNames(updatedRows);
    };

    function handleDiagnosisDropdownChange(index, event) {
        const selectedItem = event.target.value;

        const updatedRowData = [...diagnoses];
        updatedRowData[index] = selectedItem;
        setDiagnoses(updatedRowData);

        if (typeof selectedItem === 'string') {
            console.log('The field is a string.');
        } else {
            console.log('The field is not a string.');
        }

        console.log('Selected Item:', selectedItem);
    }
    function handleQualityDropdownChange(index, event) {
        const selectedItem = event.target.value;
        const updatedRowData = [...qualities];
        updatedRowData[index] = selectedItem;
        setQualities(updatedRowData);
    }


    const diagnosisToFirebase = async (name, assignment, quality, ECG_ID) => {
        try {
            // Reference to the document you want to update
            const documentRef = doc(db, "users", patient, "Observation", ECG_ID)

            // Update the document with new fields
            await setDoc(
                documentRef,
                {
                    physicianAssignedDiagnosis: assignment,
                    physician: name,
                    tracingQuality: quality,
                },
                { merge: true }
            );
            console.log('Fields added to the document successfully');
        } catch (error) {
            console.error('Error adding fields to the document:', error);
        }
    };

    const handleSave = (index, ECG_ID) => {
        console.log(`Row ${index + 1} saved: ${names[index]}`);
        console.log(`Row ${index + 1} saved: ${diagnoses[index]}`);
        console.log(`Row ${index + 1} saved: ${qualities[index]}`);
        diagnosisToFirebase(names[index], diagnoses[index], qualities[index], ECG_ID)
    };

    useEffect(() => {
        const getEcgs = async () => {
            setLoading(true);
            const ref = collection(db, "users", patient, "Observation")
            const querySnapshot = await getDocs(ref);
            const results = [];
            querySnapshot.forEach((doc1) => {
                results.push(doc1.data());
            });
            results.sort((a, b) => {
                const dateA = new Date(a.effectivePeriod.start);
                const dateB = new Date(b.effectivePeriod.start);
                if (dateA < dateB) return 1;
                if (dateB < dateA) return -1;
                return 0;
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
                <br />
                <h3>{state === null ? null: state.firstName} {state === null ? null: state.lastName}</h3>
                <br />
                
                <Dashboard ecgdata={ecgToDisplay} />
       
                <div style={{ height: 300, overflowY: 'scroll' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Watch Diagnosis</th>
                                <th>Average Heart Rate (bpm)</th>
                                <th>Physician Assigned Diagnosis </th>
                                <th>Tracing Quality </th>
                                <th>Physician Initials </th>
                                <th>Save</th>
                                <th>ECG</th>
                                <th>Saved Diagnosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ecgList.length > 0 ?

                                ecgList.map((ecg, index) => (
                                    <tr className={(ecgToDisplay && ecgToDisplay.id) === ecg.id ? 'highlightedrow' : null} key={ecg.id}>
                                        <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                                        <td>{ecg.component[2].valueString}</td>
                                        <td>{ecg.component[3].valueQuantity.value}</td>
                                        <td>
                                            <select className="dropdown" onChange={(event) => handleDiagnosisDropdownChange(index, event)}>
                                                <option value="">Select</option>
                                                <option value="Sinus Rhythm">Sinus Rhythm</option>
                                                <option value="AFib">AFib</option>
                                                <option value="SVT">SVT</option>
                                                <option value="VT">VT</option>
                                                <option value="PACs">PACs</option>
                                                <option value="PVCs">PVCs</option>
                                                <option value="Unknown">Unknown</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select className="dropdown" onChange={(event) => handleQualityDropdownChange(index, event)}>
                                                <option value="">Select</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={names[index] || ''}
                                                size="5"
                                                onChange={(event) => handleInputChange(index, event.target.value)}
                                            />
                                        </td>
                                        <td>
                                        <Button size="small" variant="contained" sx={{ width: 100, margin: 2 }}
                                            onClick={() => handleSave(index, ecg.id)}
                                        >
                                            Save
                                        </Button>
                                        </td>
                                        <td>
                                        <Button size="small" variant="contained"
                                            sx={{ width: 100, margin: 2 }} style={{ backgroundColor: '#FF6758' }}
                                            onClick={() => setEcgToDisplay(ecg)}> View ECG
                                        </Button>
                                        </td>
                                        <td>{ecg.physician} : {ecg.physicianAssignedDiagnosis}</td>
                                    </tr>
                                )) : null
                            }
                        </tbody>
                    </Table>
                    </div>
                 </Container>
     
    );
}

