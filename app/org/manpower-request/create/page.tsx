"use client"
import {ManpowerRequestCreate} from "@/app/_components/ManpowerRequestCreate";
import {useRouter} from "next/navigation";
import {createManpowerRequest} from "@/services/manpower_request.service";
import {CreateManpowerRequest} from "@/const/type/request/manpower-request.type";
import {useEffect, useState} from "react";
import {getListClient} from "@/services/client.service";
import AlertDialog from "@/app/_components/AlertDialog";

const CreateMR = () => {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const fetchClient = async () => {
        try {
            setLoading(true);
            const resp = await getListClient();

            if (resp?.data) {
                setClients(resp.data);
            }
        } catch (e) {
            console.log(e, '<<< e')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClient()
    }, [])

    const handleBackToList = () => {
        router.back();
    };

    const handleSaveRequest = async (data: CreateManpowerRequest) => {
        try {
            const resp = await createManpowerRequest(
                {
                    ...data,
                    client_id: Number(data.client_id),
                    required_count: Number(data.required_count),
                    salary_min: Number(data.salary_min),
                    salary_max: Number(data.salary_max),
                    deadline_date: new Date(data.deadline_date).toISOString(),
                }
            )

            if (resp.meta.status) {
                setOpenDialog(true);
            }
        } catch (err) {
            console.log(err, '<<< err')
        }

    };

    return (
        <div className="px-8 py-8">
            <ManpowerRequestCreate clients={clients} loading={loading} onBack={handleBackToList} onSave={handleSaveRequest} />
            <AlertDialog open={openDialog} triggerText={""} title={"Success"} description={"submit the request"} actionText={"Ok"} onSubmit={handleBackToList}/>
        </div>
    )
}

export default CreateMR;
