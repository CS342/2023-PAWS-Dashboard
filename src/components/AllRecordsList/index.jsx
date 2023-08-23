// over all patients, get all observations
// row, button to link to patient's page with clicked ecg showing
// need to set up new route with url param containing record id 
// table: first nane, last name, date, 
import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../../firebase';
import { Button } from '@mui/material';

export default function AllRecordsList() {
    const [recordsList, setRecordsList] = useState([]);
    const [loading, setLoading] = useState(false);

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


    const columns = [
        { field: 'firstName', headerName: 'First Name', flex: 1},
        { field: 'lastName', headerName: 'Last Name', flex: 1},
        { field: 'date', headerName: 'Date', flex: 2 },
        { field: 'watchDiagnosis', headerName: 'Watch Diagnosis', flex: 2 },
        // { field: 'heartRate', headerName: 'Average Heart Rate (bpm)', flex: 1 },
        {
            field: 'records',
            headerName: '',
            flex: 2,
            renderCell: (params) => {
                console.log("params", params.row); // Log the params object to the console
                
                return (
                    <Link to={`/ecglist/${params.row.userID}`} state={{firstName: params.row.firstName, lastName: params.row.lastName}}>
                        <Button size="small" variant="contained" sx={{ width: 200, margin: 2 }} style={{ backgroundColor: '#FF6758' }}>
                            View Record
                        </Button>
                    </Link>
                );
            }
        },
    ];

    const rows =
    recordsList.map((record) => (
        {
            id: record.id,
            userID: record.userID,
            firstName: record.firstName,
            lastName: record.lastName,
            date: dateToHumanReadable(record.effectivePeriod.start),
            watchDiagnosis: record.component[2].valueString,
            // heartRate: record.component[3].valueQuantity.value 

        }));

        useEffect(() => {
            const getRecords = async () => {
              setLoading(true);
              const patientsRef = collection(db, "users");
              const patientsSnapshot = await getDocs(patientsRef);
              const promises = [];
          
              patientsSnapshot.forEach((doc) => {
                const patientId = doc.id;
                const observationsRef = collection(db, "users", patientId, "Observation");
                const promise = getDocs(observationsRef)
                  .then((observationsSnapshot) => {
                    const results = [];
                    observationsSnapshot.forEach((observationDoc) => {
                      const observationData = observationDoc.data();
                      const userData = doc.data(); // User data containing first and last name
          
                      // Add first and last name to the observation data
                      const observationWithUserData = {
                        ...observationData,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userID: userData.id,
                      };
          
                      results.push(observationWithUserData);
                    });
                    return results;
                  });
                promises.push(promise);
              });
          
              const resultsArray = await Promise.all(promises);
              const mergedResults = resultsArray.flat();
              console.log(mergedResults[0]);
          
              mergedResults.sort((a, b) => {
                const dateA = new Date(a.effectivePeriod.start);
                const dateB = new Date(b.effectivePeriod.start);
                if (dateA < dateB) return 1;
                if (dateB < dateA) return -1;
                return 0;
              });
          
              setRecordsList(mergedResults);
              setLoading(false);
            };
          
            getRecords();
            

          }, []);
          
          console.log("first record", recordsList[0]);
    return (
    loading ?
        <h1>Loading ...</h1>
        :
        <div style={{ height: '100%', width: '90%', display: 'flex', flexDirection: 'column', marginTop: 12 }}>
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

