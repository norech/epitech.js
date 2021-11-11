import { ActivityCode, ActivityTypeCode, ActivityTypeTitle, DatetimeLiteral, Grade, InstanceCode, ModuleCode } from "../../common";

export interface RawProjectGroupMember {
    login: string,
    date_ins: DatetimeLiteral,
    date_modif: DatetimeLiteral | null,
    status: "pending" | "requesting" | "confirmed",
    picture: string | null,
    title: string
}

export interface RawProjectUnregisteredUser {
    login: string,
    picture: string | null,
    title: string,
    location: string | null,
    promo: number,
    course_code: `${string}/${string}`,
    grade: Grade | null,
    cycle: string,
    date_ins: DatetimeLiteral,
    credits: number,
    flags: string[],
    semester: string
}

export interface RawProjectGroup {
    id: `${number}`,
    title: string,
    code: string,
    final_note: string | null,
    repository: null,
    closed: true,
    master: RawProjectGroupMember,
    members: RawProjectGroupMember[]
}

export interface RawProject {
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    codeacti: ActivityCode,
    instancelocation: `${string}/${string}`,
    module_title: string,
    id_activite: `${number}`,
    project_title: string,
    type_title: ActivityTypeTitle,
    type_code: ActivityTypeCode,
    register: boolean,
    register_by_bloc: "0" | "1",
    register_prof: "0" | "1",
    nb_min: number,
    nb_max: number,
    begin: DatetimeLiteral | null,
    end: DatetimeLiteral | null,
    end_register: DatetimeLiteral | null,
    deadline: DatetimeLiteral | null,
    is_rdv: boolean,
    instance_allowed: string | null,
    title: string,
    description: string,
    closed: boolean,
    over: number,
    over_deadline: null,
    date_access: true,
    instance_registered: "0" | "1",
    user_project_status: null,
    root_slug: string,
    forum_path: null,
    slug: null,
    call_ihk: "0" | "1",
    nb_notes: number | null,
    user_project_master: string | null,
    user_project_code: string | null,
    user_project_title: string | null,
    registered_instance: number,
    registered: RawProjectGroup[],
    notregistered: RawProjectUnregisteredUser[]
}

export interface RawProjectRegisteredUser {
    login: string,
    date_ins: DatetimeLiteral,
    date_modif: DatetimeLiteral | null,
    status: "confirmed" | "requesting" | "unconfirmed" | "deleting" | "deleted",
    picture: string | null,
    title: string
}

export interface RawProjectRegisteredGroup {
    id: string,
    title: string,
    code: string,
    final_note: number | null,
    repository: string | null,
    project_title: string,
    closed: boolean,
    master: RawProjectRegisteredUser,
    members: RawProjectRegisteredUser[]
}

export interface RawProjectFile {
    type: "-",
    slug: string,
    title: string,
    secure: boolean,
    synchro: boolean,
    archive: boolean,
    language: string,
    size: number,
    ctime: DatetimeLiteral,
    mtime: DatetimeLiteral,
    mime: string,
    isLeaf: boolean,
    noFolder: boolean,
    rights: {
        ged_read: 0 | 1,
        ged_write: 0 | 1
    },
    modifier: {
        login: string,
        title: string,
        picture: string | null
    },
    fullpath: string
}