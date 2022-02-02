import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    const intra1 = new RawIntra({
        autologin: "https://intra.epitech.eu/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        timezone: "Europe/Paris"
    });

    const intra2 = new RawIntra({
        autologin: "https://intra.epitech.eu/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        timezone: "Indian/Reunion"
    });

    console.log(await intra1.getModuleByUrl("/module/2021/B-PRO-300/RUN-3-1"));
    console.log(await intra2.getModuleByUrl("/module/2021/B-PRO-300/RUN-3-1"));
})();
