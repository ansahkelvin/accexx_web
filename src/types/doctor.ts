

export interface DoctorSchedules {
    start_time: Date;
    end_time: Date;
    id?: string;
    doctor_id: string;
    is_booked: boolean;
}

export interface IPatients {
    id: string;
    name: string;
    email: string;
    profile_image?: string;
}

export interface DoctorDetails {
    id: string;
    email: string;
    name: string;
    gmc_number: string;
    specialization: string;
    bio: string;
    work_address: string;
    work_address_latitude: number;
    work_address_longitude: number;
    role: string;
    profile_image: string;
}
