import React, {useState} from 'react';
import {Job} from "shared-types/MyType";
import LoadingSpinner from "./LoadingSpinner";

const url = 'http://localhost:8080/jobs';
// const url = 'https://api-cc4q3pa43a-ew.a.run.app/jobs';

export const App = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>([]);

    async function getJobs() {
        setLoading(true)
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

            <button onClick={getJobs}>get jobs</button>
            <ul>
                {jobs.map(value => <li key={value.url}>{value.title}</li>)}
            </ul>
            {loading ? <LoadingSpinner/> : ""}
        </>
    );
}

export default App;
