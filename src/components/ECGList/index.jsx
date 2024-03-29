import '../../index.css'; 
import { useState, useEffect } from 'react';
import { doc, query, where, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams, useLocation } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Dashboard from '../Dashboard';
import { Container, Modal, Button as Button2 } from 'react-bootstrap';
import { Button } from '@mui/material';

export default function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecgToDisplay, setEcgToDisplay] = useState();
    const { patient } = useParams();
    const location = useLocation();
    const { firstName, lastName } = location.state
    const [names, setNames] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [qualities, setQualities] = useState([]);
    const [show, setShow] = useState(false);
    const [highlightedRow, setHighlightedRow] = useState(null); // State to track the highlighted row
    const [highlightedRowGreen, setHighlightedRowGreen] = useState(null);
  

    const [modalData, setModalData] = useState();
    const [modalEcgDate, setModalEcgDate] = useState("");

    const cellStyle = {
        padding: '15px', // Adjust the value as needed
    };

    const handleClose = () => setShow(false);

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

    const handleShow = async (modal_ecg) => {
        const collectionRef = collection(db, "users", patient, "Observation", modal_ecg.id, "Diagnosis")
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((document) => document.data());
        const fetchedDate = dateToHumanReadable(modal_ecg.effectivePeriod.start)
        setModalData(fetchedData);
        setModalEcgDate(fetchedDate);
        setShow(true);
    }

    const symptomDisplay = (ecg) => {
        let symptom = `N/A`

        if (ecg.component[4].valueString === "present"){
            let n = 5;           
            while (ecg.component[n].valueString !== undefined){
                const new_symptom = ecg.component[n].code.coding[0].display
                symptom = `${symptom}, ${new_symptom}`
                n += 1;
            }
        }

        if (symptom !== `N/A`){
            symptom = symptom.slice(5);
        }

        return symptom;
    }

    const handleInputChange = (index, value) => {
        const updatedRows = [...names];
        updatedRows[index] = value;
        setNames(updatedRows);
    };

    const handleEcgButtonClick = (rowKey) => {
        setHighlightedRow(rowKey);
        setHighlightedRowGreen(null); // Reset the other button's highlight
    };

    const handleSaveButtonClick = (rowKey) => {
        setHighlightedRowGreen(rowKey);
        setHighlightedRow(null); // Reset the other button's highlight
    };

    function handleDiagnosisDropdownChange(index, event) {
        const selectedItem = event.target.value;

        const updatedRowData = [...diagnoses];
        updatedRowData[index] = selectedItem;
        setDiagnoses(updatedRowData);
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
            const collectionRef = collection(db, "users", patient, "Observation", ECG_ID, "Diagnosis")

            // Update the document with new fields

            const q = query(collectionRef, where('physician', '==', name));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                const newDocumentRef = doc(collectionRef);
                await setDoc(
                    newDocumentRef,
                    {
                        physicianAssignedDiagnosis: assignment,
                        physician: name,
                        tracingQuality: quality,
                    }
                );
                console.log('Fields added to the document successfully');

            } else {
                console.log(name, ' diagosis input updated');
                const documentRef = doc(db, "users", patient, "Observation", ECG_ID, "Diagnosis", querySnapshot.docs[0].id);

                await setDoc(documentRef,
                    {
                        physicianAssignedDiagnosis: assignment,
                        physician: name,
                        tracingQuality: quality,
                    },
                    { merge: true }
                );

                console.log('Fields added to the document successfully');
            }
            handleSaveButtonClick(ECG_ID); // change Row to green only if save is complete
        } catch (error) {
            console.error('Error adding fields to the document: ', error);
        }
    };

    const handleSave = (index, ECG_ID) => {
        console.log(`Row ${index + 1} saved: ${names[index]}`);
        console.log(`Row ${index + 1} saved: ${diagnoses[index]}`);
        console.log(`Row ${index + 1} saved: ${qualities[index]}`);
        try {
            diagnosisToFirebase(names[index], diagnoses[index], qualities[index], ECG_ID)
          } catch (error) {
          } 
        }
        ;

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
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>ECG Diagnosis History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <p>Date: {modalEcgDate}</p>
                    <table>
                    <thead>
                        <tr>
                        <th style={cellStyle}>Physician Initials </th>
                        <th style={cellStyle}>Diagnosis</th>
                        <th style={cellStyle}>Tracing Quality</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modalData && modalData.map((document) => (
                        <tr key={document.id}>
                            <td style={cellStyle}>{document.physician}</td>
                            <td style={cellStyle}>{document.physicianAssignedDiagnosis}</td>
                            <td style={cellStyle}>{document.tracingQuality}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button2 variant="secondary" onClick={handleClose}>
                            Close
                        </Button2>
                    </Modal.Footer>
                </Modal>
                <br />

                <h3>{firstName} {lastName}</h3>
                <br />
                <Dashboard ecgdata={ecgToDisplay} />

                <div style={{ height: 300, overflowY: 'scroll' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Watch Diagnosis</th>
                                <th>Average Heart Rate (bpm)</th>
                                <th>Reported Symptoms</th>
                                <th>ECG</th>
                                <th>Physician Assigned Diagnosis </th>
                                <th>Tracing Quality </th>
                                <th>Physician Initials </th>
                                <th>Save</th>
                                <th>Saved Diagnosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ecgList.length > 0 ?

                                ecgList.map((ecg, index) => (
                                    <tr key={ecg.id}
                                        className={`
                                            ${(ecgToDisplay && ecgToDisplay.id) === ecg.id ? 'highlightedrow' : ''}
                                            ${highlightedRowGreen === ecg.id ? 'green-row' : ''}
                                        `}>

                                        <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                                        <td>{ecg.component[2].valueString}</td>
                                        <td>{ecg.component[3].valueQuantity.value}</td>
                                        <td>{symptomDisplay(ecg)}</td>
                                        <td>
                                            <Button size="small" variant="contained"
                                                sx={{ width: 100, margin: 2 }} style={{ backgroundColor: '#FD9F46' }}
                                                onClick={(event) => {
                                                    setEcgToDisplay(ecg);
                                                    handleEcgButtonClick(ecg.id);
                                                }}> 
                                                    View ECG
                                            </Button>
                                        </td>
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
                                            <Button size="small" variant="contained" 
                                                sx={{ width: 100, margin: 2 }} style={{ backgroundColor: '#10AD92' }}
                                                onClick={(event) => {
                                                    handleSave(index, ecg.id);
                                            }}>
                                                Save
                                            </Button>
                                        </td>
                                        <td>
                                            <Button size="small" variant="contained"
                                                sx={{ width: 100, margin: 2 }} style={{ backgroundColor: '#7D7D7D' }} 
                                                onClick={() => { 
                                                handleShow(ecg);
                                            }}>
                                                View History
                                            </Button>
                                        </td>
                                    </tr>
                                )) : null
                            }
                        </tbody>
                    </Table>
                </div>
            </Container>

    );
}

