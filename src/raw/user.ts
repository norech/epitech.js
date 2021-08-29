import { DatetimeLiteral } from "../common";

export interface RawUserGroup {
    title: string,
    name: string,
    count: number
}

export interface RawUserEvent {
    id_event_failed: `${number}`,
    id_user: `${number}`,
    begin: `${DatetimeLiteral}`,
    id_activite_failed: `${number}`
}

export interface RawUserGPA {
    gpa: `${number}`,
    cycle: "bachelor" | "master"
}

export interface RawUserNSStat {
    active: number,
    idle: number,
    out_active: number,
    out_idle: number,
    nslog_norm: number
}

export interface RawUser {
    login: string,
    title: string,
    internal_email: string,
    lastname: string,
    firstname: string,
    userinfo: any,
    referent_used: boolean,
    picture: string | null,
    picture_fun: string | null,
    scolaryear: `${number}`,
    promo: number,
    semester: number,
    location: `${string}/${string}`,
    userdocs: null,
    shell: null,
    close: boolean,
    ctime: `${DatetimeLiteral}`,
    mtime: `${DatetimeLiteral}`,
    id_promo: `${number}`,
    id_history: `${number}`,
    course_code: string,
    semester_code: string,
    school_id: `${number}`,
    school_code: string,
    school_title: string,
    old_id_promo: `${number}`,
    old_id_location: `${number}`,
    rights: any,
    invited: boolean,
    studentyear: number,
    admin: boolean,
    editable: boolean,
    restrictprofiles: boolean,
    groups: RawUserGroup[],
    events: RawUserEvent[],
    credits: number,
    gpa: RawUserGPA,
    spice: any,
    nsstat: RawUserNSStat | null
}