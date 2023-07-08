import { useState, useEffect } from 'react';
import { getDocs, setDoc, collection} from 'firebase/firestore';
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
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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

    const [rows, setRows] = useState([]);

    const handleInputChange = (index, value) => {
      const updatedRows = [...rows];
      updatedRows[index] = value;
      setRows(updatedRows);
    };
  

    const diagnosisToFirebase = async (field, ECG_ID) => {
        if (typeof field === 'string') {
            console.log('The field is a string.');
          } else {
            console.log('The field is not a string.');
          }
          
        try {
          // Reference to the document you want to update
          const documentRef = collection(db, "users", patient, "Observation", ECG_ID, "Physician_Assigned_Diagonsis")
      
          // Update the document with new fields
          await setDoc(documentRef, field);
      
          console.log('Fields added to the document successfully');
        } catch (error) {
          console.error('Error adding fields to the document:', error);
        }
      };

    const handleSave = (index, ECG_ID) => {
        console.log(`Row ${index + 1} saved: ${rows[index]}`);
        diagnosisToFirebase(rows[index], ECG_ID)
    };

    return (
        loading ?
        <h1>Loading ...</h1>
        :
        <Container>
        <br />
        <h3>{firstName} {lastName}</h3>
        <br />
        <Dashboard ecgdata={ecgToDisplay} />
        <div style={{height: 300, overflowY: 'scroll'}}>
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Watch Diagnosis</th>
                    <th>Average Heart Rate (bpm)</th>
                    <th>Physician Assigned Diagonsis </th>
                    <th>Save</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {ecgList.map((ecg, index) => (
                    <tr className={(ecgToDisplay && ecgToDisplay.id) === ecg.id ? 'highlightedrow' : null} key={ecg.id}>
                    <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                    <td>{ecg.component[2].valueString}</td>
                    <td>{ecg.component[3].valueQuantity.value}</td>
                    <td>
                        <input
                        type="text"
                        value={rows[index] || ''}
                        onChange={(event) => handleInputChange(index, event.target.value)}
                        />
                    </td>
                    <td>
                        <button type= "button" onClick={() => handleSave(index, ecg.id)}>Save</button>
                    </td>
                    <td>
                        <Button
                        style={{ background: 'salmon' }}
                        onClick={() => setEcgToDisplay(ecg)}
                        aria-label="View ECG"
                        >
                        View ECG
                        </Button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
        </Container>
    );
}

export default ECGList;