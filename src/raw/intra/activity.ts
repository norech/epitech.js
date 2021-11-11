import { ActivityCode, ActivityTypeCode, ActivityTypeTitle, DatetimeLiteral, EventCode, HourLiteral, InstanceCode, MinuteLiteral, ModuleCode, SecondLiteral, TimeLiteral, UserStatus } from "../../common";
import { RawMember } from "./common";

export interface RawActivityEvent {
    code: EventCode,
    num_event: `${number}`,
    seats: `${number}`,
    title: string | null,
    description: string | null,
    nb_inscrits: `${number}`,
    begin: DatetimeLiteral,
    end: DatetimeLiteral,
    id_activite: `${number}`,
    location: `${string}/${string}/${string}`,
    nb_max_students_projet: number | null,
    already_register: `${number}` | null,
    user_status: UserStatus,
    allow_token: "0" | "1",
    assistants: RawMember[]
}

export interface RawActivityProject {
    id: number,
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    title: string
}

export interface RawActivity {
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    codeacti: ActivityCode,
    call_ihk: `${number}` | null,
    slug: string | null,
    instance_location: string,
    module_title: string,
    title: string,
    description: string,
    type_title: ActivityTypeTitle,
    type_code: ActivityTypeCode,
    begin: DatetimeLiteral,
    start: DatetimeLiteral,
    end_register: DatetimeLiteral | null,
    deadline: DatetimeLiteral | null,
    end: DatetimeLiteral,
    nb_hours: TimeLiteral | null,
    nb_group: number,
    num: number,
    register: "0" | "1",
    register_by_bloc: "0" | "1",
    register_prof: "0" | "1",
    title_location_type: string | null,
    is_projet: boolean,
    id_projet: `${number}` | null,
    project_title: string | null,
    is_note: boolean,
    nb_notes: number | null,
    is_blocins: boolean,
    rdv_status: "open" | "close",
    id_bareme: `${number}` | null,
    title_bareme: string | null,
    archive: "0" | "1",
    hash_elearning: string | null,
    ged_node_adm: any | null,
    nb_planified: number | null,
    hidden: boolean,
    project: any | null,
    student_registered: {
        registered: "0" | "1"
    } | null,
    events: RawActivityEvent[]
}