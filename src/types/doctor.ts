

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