import { useState, useEffect } from 'react';
import { doc, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from "react-router-dom";
import Dashboard from '../Dashboard';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button } from '@mui/material';

export default function ECGList() {
    const [ecgList, setEcgList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecgToDisplay, setEcgToDisplay] = useState();
    const { patient } = useParams();
    // const location = useLocation();
    // const { firstName, lastName } = location.state
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
        // const updatedRows = [...names];
        // updatedRows[index] = value;
        // setNames(updatedRows);
        setNames((prevNames) => ({
            ...prevNames,
            [index]: value,
          }));
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

    const columns = [
        { field: 'date', headerName: 'Date', flex: 2 },
        { field: 'watchDiagnosis', headerName: 'Watch Diagnosis', flex: 2 },
        { field: 'heartRate', headerName: 'Average Heart Rate (bpm)', flex: 1 },
        {
            field: 'physicianDiagnosis', headerName: 'Physician Assigned Diagnosis)', flex: 2,
            renderCell: (params) => (
                <select className="dropdown" onChange={(event) => handleDiagnosisDropdownChange(params.rowIndex, event)}>
                    <option value="">Select</option>
                    <option value="Sinus Rhythm">Sinus Rhythm</option>
                    <option value="AFib">AFib</option>
                    <option value="SVT">SVT</option>
                    <option value="VT">VT</option>
                    <option value="PACs">PACs</option>
                    <option value="PVCs">PVCs</option>
                    <option value="Unknown">Unknown</option>
                </select>)
        },
        {
            field: 'tracingQuality', headerName: 'Tracing Quality', flex: 1, renderCell: (params) =>
            (
                <select className="dropdown" onChange={(event) => handleQualityDropdownChange(params.rowIndex, event)}>
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            )
        },
        {
            field: 'physicianInitials', headerName: 'Physician Initials', flex: 1, renderCell: (params) =>
            (
                <input
                    type="text"
                    value={names[params.rowIndex] || ''}
                    size="5"
                    onChange={(event) => handleInputChange(params.rowIndex, event.target.value)}
                />
            )
        },
        {
            field: 'save', headerName: '', flex: 1, renderCell: (params) =>
            (
                <Button size="small" variant="contained" sx={{ width: 200, margin: 2 }}
                    onClick={() => handleSave(params.rowIndex, ecgList[params.rowIndex]?.id)}
                >
                    Save
                </Button>
            )
        },
        {
            field: 'ecg', headerName: 'View ECG)', flex: 2, renderCell: (params) => (
                <Button size="small" variant="contained"
                    sx={{ width: 200, margin: 2 }} style={{ backgroundColor: '#FF6758' }}
                    onClick={() => setEcgToDisplay(ecgList[params.rowIndex])}> View ECG
                </Button>
            )
        },
        {
            field: 'savedDiagnosis', headerName: 'Saved Diagnosis)', flex: 2, renderCell: (params) => (
                <Typography>
                     {ecgList[params.rowIndex].physician ? (
                        ecgList[params.rowIndex].physician
                    ) : "" }
                </Typography>
            )
        }
    ];

    const rows = ecgList.map((ecg) => (
        {
            id: ecg.id,
            date: dateToHumanReadable(ecg.effectivePeriod.start),
            watchDiagnosis: ecg.component[2].valueString,
            heartRate: ecg.component[3].valueQuantity.value,
        }
    ));

    return (
        loading ?
            <h1>Loading ...</h1>
            :
            <Container>
                  <Dashboard ecgdata={ecgToDisplay} />
                    <div style={{ height: '100%', width: '90%', display: 'flex', flexDirection: 'column' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            disableRowSelectionOnClick
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                        />
                    </div>
            </Container>         
     
    );
}

