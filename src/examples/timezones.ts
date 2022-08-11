import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    class Provider {
        refresh = async () => "{authentication cookie}";
    }

    const intra1 = new RawIntra({
        provider: new Provider(),
        timezone: "Europe/Paris"
    });

    const intra2 = new RawIntra({
        provider: new Provider(),
        timezone: "Indian/Reunion"
    });

    console.log(await intra1.getModuleByUrl("/module/2021/B-PRO-300/RUN-3-1"));
    console.log(await intra2.getModuleByUrl("/module/2021/B-PRO-300/RUN-3-1"));
})();
