import { ActivityCode, ActivityTypeCode, ActivityTypeTitle, DatetimeLiteral, ModuleCode, DateLiteral, InstanceCode, Grade, TimeLiteral, EventCode } from "../../common";

export interface RawModuleBoardActivity {
    title_module: string;
    codemodule: ModuleCode;
    scolaryear: `${number}`,
    codeinstance: InstanceCode,
    code_location: string,
    begin_event: DatetimeLiteral | null,
    end_event: DatetimeLiteral | null,
    seats: `${number}` | null,
    num_event: `${number}` | null,
    type_acti: ActivityTypeTitle,
    type_acti_code: ActivityTypeCode,
    codeacti: ActivityCode,
    acti_title: string,
    num: `${number}`,
    begin_acti: DatetimeLiteral | null,
    end_acti: DatetimeLiteral | null,
    registered: 0 | 1,
    info_creneau: DatetimeLiteral | null,
    project: string,
    rights: string[]
}

export interface RawModuleSummay {
    id: number,
    title_cn: string | null,
    semester: number,
    num: `${number}`,
    begin: DateLiteral,
    end: DateLiteral,
    end_register: DateLiteral,
    scolaryear: number,
    code: ModuleCode,
    codeinstance: InstanceCode,
    location_title: string,
    instance_location: `${string}/${string}`,
    flags: `${number}`,
    credits: `${number}`,
    rights: string[],
    status: "valid" | "fail" | "ongoing",
    waiting_grades: null,
    active_promo: "0" | "1",
    open: "0" | "1"
}

export interface RawCourseFilterOutput {
    preload: Array<[number, number, `${string}/${string}`, `${string}/${string}`, string]>,
    items: RawModuleSummay[]
}

export interface RawModuleActivityProject {
    id: number,
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    title: string
}

export interface RawModuleActivityEvent {
    code: EventCode,
    num_event: `${number}`,
    seats: `${number}` | null,
    title: string | null,
    description: string | null,
    nb_inscrits: `${number}`,
    begin: DatetimeLiteral | null,
    end: DatetimeLiteral | null,
    id_activite: `${number}`,
    location: `${string}/${string}/${string}` | null,
    nb_max_students_projet: `${number}` | null,
    already_register: `${number}` | null,
    user_status: "present" | "absent" | null,
    allow_token: "0" | "1",
    assistants: any[]
}

export interface RawModuleActivity {
    codeacti: ActivityCode,
    call_ihk: "0" | "1",
    slug: string,
    instance_location: `${string}/${string}`,
    module_title: string,
    title: string,
    description: string,
    type_title: ActivityTypeTitle,
    type_code: ActivityTypeCode,
    begin: DatetimeLiteral | null,
    start: DatetimeLiteral | null,
    end_register: DatetimeLiteral | null,
    deadline: DatetimeLiteral | null,
    end: DatetimeLiteral | null,
    nb_hours: TimeLiteral | null,
    nb_group: number,
    num: number,
    register: "0" | "1",
    register_by_bloc: "0" | "1",
    register_by_prof: "0" | "1",
    title_location_type: string | null,
    is_projet: boolean,
    id_projet: `${number}`,
    project_title: string,
    is_note: boolean,
    nb_notes: number | null,
    is_blocins: boolean,
    rdv_status: "open" | "close",
    id_bareme: number | null,
    title_bareme: string | null,
    archive: "0" | "1",
    hash_elearning: string | null,
    ged_code_abm: string | null,
    nb_planified: number | null,
    hidden: boolean,
    project: RawModuleActivityProject | null,
    events: RawModuleActivityEvent[]
}

export interface RawModule {
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    semester: number,
    scolaryear_template: `${number}`,
    title: string,
    begin: DateLiteral,
    end: DateLiteral,
    end_register: DateLiteral,
    past: "0" | "1",
    closed: "0" | "1",
    opened: "0" | "1",
    user_credits: `${number}`,
    credits: number,
    description: string,
    competence: string,
    flags: `${number}`,
    instance_flags: `${number}`,
    max_ins: null,
    instance_location: `${string}/${string}`,
    hidden: "0" | "1",
    old_acl_backup: null,
    resp: any[],
    assistant: any[],
    rights: null,
    template_resp: any[],
    allow_register: 0 | 1,
    date_ins: DatetimeLiteral,
    student_registered: 0 | 1,
    student_grade: Grade | "N/A",
    student_credits: number,
    color: string,
    student_flags: `${number}`,
    current_resp: boolean,
    activites: RawModuleActivity[]
}

export interface RawModuleActivityAppointmentEvents {
    id: `${number}`,
    nb_registered: `${number}`,
    begin: DatetimeLiteral | null,
    register: "0" | "1",
    num_event: `${number}`,
    end: DatetimeLiteral | null,
    location: `${string}/${string}/${string}`,
    title: string,
    date_ins: DatetimeLiteral,
    date_modif: DatetimeLiteral | null
}

export interface RawModuleActivityAppointmentSlots {
    id: number,
    title: string,
    bloc_status: "oneshot",
    room: `${string}/${string}/${string}`
    slots: RawModuleActivityAppointmentSlotsSlots
}

export interface RawModuleActivityAppointmentSlotsSlots {
    acti_title: string,
    date: DatetimeLiteral,
    duration: number,
    status: "open" | "close",
    bloc_status: "oneshot",
    id_team: `${number}` | null,
    id_user: `${number}` | null,
    date_ins: DatetimeLiteral | null,
    code: string | null,
    title: string | null,
    module_title: string,
    members_pictures: null,
    past: 0 | 1,
    master: {
        login: string,
        title: string,
        picture: string | null
    } | null,
    members: Array<{
        login: string,
        title: string,
        picture: string | null
    }>,
    id: number
}

export interface RawModuleActivityAppointment {
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    codeacti: ActivityCode,
    nb_notes: number,
    register_by_bloc: boolean,
    group?: {
        id: number,
        code: string,
        title: string,
        inscrit: boolean,
        master: string,
        members: string[]
    },
    projects: Array<{
        title: string,
        codeacti: ActivityCode,
        id_projet: `${number}`
    }>,
    events: RawModuleActivityAppointmentEvents[],
    title: string,
    description: string,
    instance_location: `${string}/${string}`,
    student_registered?: boolean,
    module_title: string,
    project: {
        id: number,
        scolaryear: `${number}`,
        codemodule: ModuleCode,
        codeinstance: InstanceCode,
        title: string
    } | null,
    with_project: boolean,
    nb_registered: number,
    nb_slots_full: number,
    slots: RawModuleActivityAppointmentSlots[]
}

export interface RawModuleRegisteredUser {
    login: string,
    picture: string | null,
    title: string,
    location: string | null,
    promo: number,
    course_code: `${string}/${string}`,
    grade: Grade | "-" | null,
    cycle: string,
    date_ins: DatetimeLiteral,
    credits: number,
    flags: [],
    semester: string
}