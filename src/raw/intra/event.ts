import { ActivityCode, ActivityTypeCode, ActivityTypeTitle, DatetimeLiteral, EventCode, HourLiteral, InstanceCode, MinuteLiteral, ModuleCode, SecondLiteral, TimeLiteral } from "../../common";
import { RawRoom } from "./common";

export interface RawEvent {
    scolaryear: `${number}`,
    codemodule: ModuleCode,
    codeinstance: InstanceCode,
    codeacti: ActivityCode,
    codeevent: EventCode,
    semester: number,
    instance_location: string,
    module_title: string,
    acti_title: string,
    acti_description: string,
    type_title: ActivityTypeTitle,
    type_code: ActivityTypeCode,
    allowed_planning_start: DatetimeLiteral,
    allowed_planning_end: DatetimeLiteral,
    nb_hours: TimeLiteral | null,
    nb_group: number,
    has_exam_subject: boolean,
    begin: DatetimeLiteral,
    end: DatetimeLiteral,
    num_event: number,
    title: string | null,
    description: string | null,
    nb_registered: number,
    id_dir: `${number}`,
    room: RawRoom,
    seats: number | null,
    desc_webservice: string,
    name_bocal: number
}

export interface RawEventRegisteredUser {
    id: `${number}`,
    login: string,
    title: string | null,
    picture: string | null,
    present: "present" | "absent" | "refused" | "excused" | "N/A",
    token_trace: null,
    can_token: "0" | "1",
    registered: "0" | "1",
    date_ins: DatetimeLiteral,
    date_modif: DatetimeLiteral | null
}