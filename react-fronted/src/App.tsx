import React, {useState} from 'react';
import {Job} from "shared-types/MyType";

export const App = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

    async function getJobs() {
        // (async () => {
        // const url = 'http://localhost:8080/jobs';
        const url = 'https://api-cc4q3pa43a-ew.a.run.app/jobs';
        const response = await fetch(url);
        const body = response.body;
        const reader = body?.getReader();
        const decoder = new TextDecoder();
        let result = await reader?.read();
        while (!result?.done) {
            const text = decoder.decode(result?.value);
            console.log('chunk is', text)
            if (text === '#####' || text === '') {
                console.log('skip', text)
            } else {
                console.log('parse', text)
                const json = JSON.parse(text);
                setJobs(jobs => [...jobs, json])
            }
            result = await reader?.read()
        }
        // })()
    }

    return (
        <>
            <div style={{textAlign: 'center'}}>
                <h1>Welcome to xingedin!</h1>
            </div>
            <button onClick={getJobs}>get jobs</button>
            <ul>
                {jobs.map(value => <li>{value.title}</li>)}
            </ul>
        </>
    );
}

export default App;
