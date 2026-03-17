export type CreateManpowerRequest = {
    client_id: number,
    position: string,
    required_count: number,
    salary_min: number,
    salary_max: number,
    work_location: string,
    deadline_date: string,
    job_description: string
}