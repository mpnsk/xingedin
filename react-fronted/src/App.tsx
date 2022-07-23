import TableContainer from '@mui/material/TableContainer/TableContainer';
import React, {useState} from 'react';
import {Job} from "shared-types/MyType";
import LoadingSpinner from "./LoadingSpinner";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

const url = 'http://localhost:8080/jobs';
// const url = 'https://api-cc4q3pa43a-ew.a.run.app/jobs';

export const App = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>([]);

    async function getJobs() {
        setLoading(true)
        setJobs([])
        const response = await fetch(url);
        const body = response.body;
        const reader = body?.getReader();
        const decoder = new TextDecoder();
        let result = await reader?.read();
        const delimiter = '#####';
        while (!result?.done) {
            const text = decoder.decode(result?.value);
            console.log('chunk is', text)
            if (text === delimiter || text === '') {
                console.log('skip', text)
            } else {
                const strings = text.split(delimiter);
                for (let i = 0; i < strings.length; i++) {
                    const string = strings[i];
                    if (string === "") continue
                    try {
                        const json = JSON.parse(string);
                        setJobs(jobs => [...jobs, json])
                    } catch (err) {
                        console.log('i', i)
                        console.log('string', string)
                        console.error('error parsing ' + string, err)
                    }
                }
            }
            result = await reader?.read()
        }
        setLoading(false)
    }

    return (
        <>
            <div style={{textAlign: 'center'}}>
                <h1>Welcome to xingedin!</h1>
            </div>

            <button onClick={getJobs}>{jobs.length == 0 ? "get jobs" : "clear all and get again"}</button>
            {loading ? <LoadingSpinner/> : ""}
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Company</TableCell>
                            <TableCell align="right">Location</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow
                                key={job.url}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <a href={job.url}>
                                        {job.title}
                                    </a>
                                </TableCell>
                                <TableCell align="right">{job.company}</TableCell>
                                <TableCell align="right">{job.location}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default App;
