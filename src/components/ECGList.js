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

    const [text, setText] = useState('');
    const [savedText, setSavedText] = useState('');
    const [activeRow, setActiveRow] = useState(null);


    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleSave = () => {
        if (activeRow) {
          setSavedText(text);
          const docRef = db.collection('rows').doc(activeRow);
          docRef.set({ text })
            .then(() => {
              console.log('Row data saved successfully!');
            })
            .catch((error) => {
              console.error('Error saving row data:', error);
            });
          setActiveRow(null);
          setText('');
        }
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
                </tr>
            </thead>
            <tbody>
                {ecgList.map((ecg) => (
       
                    <tr className={(ecgToDisplay && ecgToDisplay.id) === ecg.id ? 'highlightedrow' : null}>
                        <td>{dateToHumanReadable(ecg.effectivePeriod.start)}</td>
                        <td>{ecg.component[2].valueString}</td>
                        <td>{ecg.component[3].valueQuantity.value}</td>
                        <td>
                        <input type="text" value={text} onChange={handleChange} />
                        </td>
                        <td>
                        <button type="button" onClick={handleSave}>Save</button>
                        </td>
                        <tr>
                            <td>Saved:</td>
                            <td>{savedText}</td>
                        </tr>                       
                        <td><Button style={{background: "salmon" }} onClick={() => setEcgToDisplay(ecg)} aria-label="View ECG">View ECG</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </div>
        </Container>
    );
}

export default ECGList;