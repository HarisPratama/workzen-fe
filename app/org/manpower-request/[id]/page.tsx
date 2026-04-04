"use client"
import {ManpowerRequestDetail} from "@/app/_components/ManpowerRequestDetail";
import {useRouter, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getDetailManpowerRequest, getManpowerRequest} from "@/services/manpower_request.service";
import {ManpowerRequest} from "@/app/_components/ManpowerRequestList";

type PageType = "dashboard" | "manpower-requests" | "manpower-create" | "manpower-detail";

const MRDetail  = () => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [manpowerRequest, setManpowerRequest] = useState<ManpowerRequest>({
        id: "",
        position: "",
        client: {
            company_name: ""
        },
        required_count: 0,
        salary_min: 0,
        salary_max: 0,
        hired: 0,
        status: "OPEN",
        deadline_date: "",
        work_location: "",
        job_description: "",
        public_token: "",
        created_at: ""
    });

    const fetchManpowerRequest = async (id: string) => {
        try {
            setLoading(true);

            const resp = await getDetailManpowerRequest(id);

            if (resp?.data) {
                setManpowerRequest(resp.data);
            }
        } catch (error) {
            console.error("Failed to fetch manpower requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchManpowerRequest(params.id as string);
        }
    }, [])

    const handleBackToList = () => {
        router.back()
    };

    return (
        <div className="px-8 py-8">
            <ManpowerRequestDetail loading={loading} onBack={handleBackToList} manpowerRequest={manpowerRequest as ManpowerRequest} onRefetch={() => fetchManpowerRequest(params.id as string)} />
        </div>
    )
}

export default MRDetail;
