// tricks to import fs whilst avoiding devdependency on @types/node,
// since this just an example and we only need the module in this file
declare const require: (path: string) => any;
const fs = require("fs");  // import fs from "fs";

import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    class Provider {
        refresh = async () => "{authentication cookie}";
    }

    const intra = new RawIntra({
        provider: new Provider()
    });

    const stream = await intra.getCalendarFile({
        locations: ['FR/RUN', 'FR'],
        semesters: [0, 5, 6],
        onlyMyEvent: true,
        onlyMyPromo: true,
        onlyMyModule: true
    });
    stream.pipe(fs.createWriteStream("calendar.ical"));

})();
