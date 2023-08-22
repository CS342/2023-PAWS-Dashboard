import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../../firebase';
import { Typography, Button } from '@mui/material';
import './styles.css'; 


export default function PatientList() {
    const [patientList, setPatientList] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [
        { field: 'firstName', headerName: 'First Name', flex: 1},
        { field: 'lastName', headerName: 'Last Name', flex: 1},
        {
            field: 'records',
            headerName: '',
            flex: 0.5,
            renderCell: (params) => {
                console.log("patient row params", params.row); // Log the params object to the console
                
                return (
                    <Link to={`/ecglist/${params.id}`} state={{ firstName: params.firstName, lastName: params.lastName }}>
                    <Button size="small" variant="contained" sx={{ width: 200, margin: 2 }} style={{ backgroundColor: '#FF6758' }}>
                        View Records
                    </Button>
                    </Link>
                );
            },
        },
    ];

    const rows =
        patientList.map((patient) => (
            {
                id: patient.id,
                firstName: patient.firstName,
                lastName: patient.lastName
            }));

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
        loading ?
            <h1>Loading ...</h1>
            :
            <div style={{ height: '100%', width: '90%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" gutterBottom sx={{paddingTop: 4}}> 
                    Welcome to the PAWS Dashboard!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Select a patient to get started.
                </Typography>
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
    );
}

