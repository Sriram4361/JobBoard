import React, { useEffect, useState } from 'react';
import './JobTable.css'
import { getData, postData } from '../../RestAPIs/Apis';

const JobTable = () => {

    const [comments, setComments] = useState({})
    const [response, setResponse] = useState([])
    var selectedJobs = new Set()

    const colorDict = { "Applied": "green", "Not Applied": "grey", "Rejected": "red", "Pending": "Orange" }
    const [statusCount, setStatusCount] = useState({ "Applied": 0, "Not Applied": 0, "Rejected": 0, "Pending": 0 })

    const statusUpdate = async (buttonValue) => {
        const apiPromises = [];
        selectedJobs.forEach(selectedJob => {
            const apiCallPromise = postData("http://localhost:8000/status", { jobid: selectedJob, userid: 17, status: buttonValue, comment: comments[selectedJob] });
            apiPromises.push(apiCallPromise)
        })
        await Promise.all(apiPromises);
        selectedJobs = new Set()
        fetchTableDataAndPopulate()
    }

    useEffect(() => {
        fetchTableDataAndPopulate();
    }, [])

    const buttonClicked = (item, index) => {
        if (item.status != "Applied")
            postData("http://localhost:8000/status", { jobid: item.id, userid: 17, status: "Applied", comment: item.comment }).then(rs => {
                setResponse((prevValue) => {
                    prevValue[index]['status'] = "Applied"
                    return [...prevValue]
                })
                var temp = statusCount;
                temp['Applied']++;
                setStatusCount({ ...temp })
            })
    }

    const updateClicked = (item, index) => {
        postData("http://localhost:8000/status", { jobid: item.id, userid: 17, status: item.status, comment: comments[item.id] }).then(rs => {
            setResponse((prevValue) => {
                prevValue[index]['comment'] = comments[item.id]
                return [...prevValue]
            })
        })
    }

    const CommentChange = (event, id) => {
        setComments(prevValue => ({
            ...prevValue, [id]: event.target.value
        }))
    }


    const fetchTableDataAndPopulate = () => {
        getData("http://localhost:8000/jobs").then(data => {
            const temp_status = { "Applied": 0, "Not Applied": 0, "Rejected": 0, "Pending": 0 }
            for (var i = 0; i < data.length; i++) {
                let company = data[i]['company']
                let date = new Date(data[i]['dateposted'])
                data[i]['dateposted'] = date.toLocaleString('en-us', { month: 'short', day: 'numeric' })
                if (data[i]['company'] === '↳') {
                    data[i]['company'] = data[i - 1]['company']
                }
                else if (company.startsWith("http")) {
                    data[i]['company'] = company.split('/').pop()
                }
                if (data[i]['status'] === null) {
                    data[i]['status'] = "Not Applied"
                }

                temp_status[data[i]['status']]++;
            }
            setResponse([...data])
            var commentsDict = {}
            data.forEach(row => {
                commentsDict[row["id"]] = row["comment"]
            })
            setComments(commentsDict)
            setStatusCount(temp_status)
        });
    }

    const handleCheckboxChange = (id, event) => {
        if (event.target.checked) {
            selectedJobs.add(id)
        }
        else {
            selectedJobs.delete(id)
        }
    }

    return (
        <div>
            <div className="stats-panel">
                <div className="stats-box total">
                    <div className="count">{response.length}</div>
                    <div className="label">Total</div>
                </div>
                <div className="stats-box applied">
                    <div className="count">{statusCount["Applied"]}</div>
                    <div className="label">Applied</div>
                </div>
                <div className="stats-box rejected">
                    <div className="count">{statusCount["Rejected"]}</div>
                    <div className="label">Rejected</div>
                </div>
                <div className="stats-box progress">
                    <div className="count">{statusCount["Pending"]}</div>
                    <div className="label">In Progress</div>
                </div>
                <div className="stats-box notapplied">
                    <div className="count">{statusCount["Not Applied"]}</div>
                    <div className="label">Not Applied</div>
                </div>
            </div>
            <div className="control-panel">
                <button className="control-button" style={{ backgroundColor: 'green' }} onClick={() => statusUpdate("Applied")}>Applied</button>
                <button className="control-button" style={{ backgroundColor: 'red' }} onClick={() => statusUpdate("Rejected")}>Rejected</button>
                <button className="control-button" style={{ backgroundColor: 'grey' }} onClick={() => statusUpdate("Not Applied")}>Not Applied</button>
                <button className="control-button" style={{ backgroundColor: 'orange' }} onClick={() => statusUpdate("Pending")}>Assessment Pending</button>
            </div>
            <div className="tableContent">
                <table >
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}>Select</th>
                            <th style={{ width: "10%" }}>Company</th>
                            <th style={{ width: "20%" }}>Role</th>
                            <th style={{ width: "10%" }}>Location</th>
                            <th style={{ width: "10%" }}>Application Link</th>
                            <th style={{ width: "10%" }}>Date Posted</th>
                            <th style={{ width: "30%" }}>Comments</th>
                            <th style={{ width: "5%" }}>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {response.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        // checked={item.id in selectedJobs}
                                        onChange={(event) => handleCheckboxChange(item.id, event)}
                                    />
                                </td>
                                <td>{item.company}</td>
                                <td>{item.role}</td>
                                <td>{item.location}</td>
                                <td>
                                    {item.applicationlink != "🔒" ? <a href={item.applicationlink} target='_blank'>
                                        <button onClick={() => buttonClicked(item, index)} style={{ backgroundColor: colorDict[item.status] }}> Apply </button>
                                    </a> : "🔒"}
                                </td>
                                <td>{item.dateposted}</td>
                                <td><input type="text" value={comments[item.id] || ''} onChange={(event) => CommentChange(event, item.id)} style={{ width: "90%" }}></input></td>
                                <td>
                                    <button onClick={() => updateClicked(item, index)} style={{ backgroundColor: 'purple' }}> Update </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default JobTable;
