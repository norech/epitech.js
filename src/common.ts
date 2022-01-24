export type LowercaseAlphabetLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
export type UppercaseAlphabetLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

export type ModulePrefix = "B" | "M" | "C" | "G" | "W" | "T";

export type YearLiteral = `${number}`;
export type MonthLiteral = `${number}`;
export type DayLiteral = `${number}`;
export type HourLiteral = `${number}`;
export type MinuteLiteral = `${number}`;
export type SecondLiteral = `${number}`;

export type ModuleCode = `${ModulePrefix}-${string}-${number}`;
export type InstanceCode = `${string}-${number}-${number}`;
export type ActivityCode = `acti-${number}`;
export type EventCode = `event-${number}`;

export type ModuleStatus = "valid" | "fail" | "ongoing" | "notregistered";
export type UserStatus = "registered" | "present" | "absent" | false;
export type ActivityTypeCode = "rdv" | "tp" | "class" | "exam" | "other" | "proj";
export type ActivityTypeTitle = "Follow-up" | "TD" | "Workshop" | "Kick-off" | "Delivery" | "Review" | "Defense" | "Bootstrap" | "Project time" | `CUS - ${string}` | "MCQ" | "Conference" | "Accompagnement" | "TEPitech" | "Project";
export type Grade = "A" | "B" | "C" | "D" | "Acquis" | "Echec";

export type DatetimeLiteral = `${YearLiteral}-${MonthLiteral}-${DayLiteral} ${HourLiteral}:${MinuteLiteral}:${SecondLiteral}`;
export type DatetimeDMYLiteral = `${DayLiteral}/${MonthLiteral}/${YearLiteral}, ${HourLiteral}:${MinuteLiteral}`;
export type DateDMYLiteral = `${DayLiteral}/${MonthLiteral}/${YearLiteral}`;
export type DateLiteral = `${YearLiteral}-${MonthLiteral}-${DayLiteral}`;
export type TimeLiteral = `${HourLiteral}:${MinuteLiteral}:${SecondLiteral}`;