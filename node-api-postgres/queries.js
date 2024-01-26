const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'japp',
    password: 'Gaya@1234',
    port: 5432,
})

//store jobs in db
const getJobs = (request, response) => {
    var select_query = 'SELECT id, company, role, location, applicationlink, dateposted, status, comment FROM jobs LEFT JOIN application_status\
    ON user_id=17 and application_status.job_id=jobs.id ORDER BY jobs.id DESC'
    pool.query(select_query, (error, results) => {
        if (error) {
            throw error
        }
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(results.rows)
    })
}


//create users
const createUser = (request, response) => {
    const { username, password } = request.body;

    pool.query('INSERT INTO USERS (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send({ id: results.rows[0].id })
    })
}

//get users

const getUser = (request, response) => {
    const { username } = request.body;

    pool.query('Select id,username from  USERS where username =  VALUES ($1) RETURNING *', [username], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send({ id: results.rows[0].id })
    })
}

//login handler
const login = (request, response) => {
    const { username, password } = request.body;
    //handle duplicate usernames
    pool.query('Select id, username, password from users where username=($1) and password=($2)', [username, password], (error, results) => {
        if (error) {
            throw error
        }
        response.setHeader('Content-Type', 'application/json');
        if (results.rowCount == 0) {
            console.log("results", results)
            response.status(401).json({ error: "username/password incorrect" })
        }
        else {
            console.log("hello", results.rows[0].id)
            response.status(201)
        }
    })
}

//create users
const setJobStatus = (request, response) => {
    // console.log(request.body)

    const { jobid, userid, status, comment } = request.body;

    var insert_statement = 'INSERT INTO application_status (job_id, user_id, status, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (job_id, user_id) DO UPDATE SET status = $3, comment=$4';
    pool.query(insert_statement, [jobid, userid, status, comment], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ id: jobid })
    })
}


module.exports = {
    createUser,
    getJobs,
    login,
    getUser,
    setJobStatus
}



