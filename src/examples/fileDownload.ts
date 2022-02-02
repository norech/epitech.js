// tricks to import fs whilst avoiding devdependency on @types/node,
// since this just an example and we only need the module in this file
declare const require: (path: string) => any;
const fs = require("fs");  // import fs from "fs";

import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    const intra = new RawIntra({
        autologin: "https://intra.epitech.eu/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    });

    const stream = await intra.downloadFile("/module/2021/B-PRO-300/RUN-3-1/acti-458897/project/file/B-PRO-300_internship.pdf");
    stream.pipe(fs.createWriteStream("B-PRO-300_internship.pdf"));

})();
