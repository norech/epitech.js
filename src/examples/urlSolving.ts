import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    class Provider {
        refresh = async () => "{authentication cookie}";
    }

    const intra = new RawIntra({
        provider: new Provider()
    });

    console.log(intra.solveUrl("https://intra.epitech.eu/module/2021/B-YEP-410/RUN-4-1/acti-503248/project/file/binaries/?format=json"));
    console.log(intra.solveUrl("https://intra.epitech.eu/module/2021/B-YEP-410/RUN-4-1/acti-503248/project/file/binaries/"));
    console.log(intra.solveUrl("/module/2021/B-PRO-300/RUN-3-1/acti-458897/project", ["projectfile"]));
    console.log(intra.solveUrl("https://intra.epitech.eu/module/2021/B-YEP-410/RUN-4-1/acti-503248/project/file/binaries/zappy_server", ['projectfile']));

    console.log(await intra.getModuleByUrl("/module/2021/B-PRO-300/RUN-3-1/acti-458897/project/file/B-PRO-300_internship.pdf"));
    
    console.log(await intra.getModuleByUrl("/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/module/2021/B-PRO-300/RUN-3-1/acti-458897/project/file/B-PRO-300_internship.pdf"));
    
    console.log(await intra.getModuleByUrl("https://intra.epitech.eu/module/2021/B-PRO-300/RUN-3-1/acti-458897"));

    try {
        // not a module url
        console.log("URL: /auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/")
        console.log(await intra.getModuleByUrl("/auth-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/"));
    } catch (e) {
        console.log("First error:")
        console.log(e);
    }

    try {
        // incomplete module url (no instance)
        console.log("URL: /module/2021/B-PRO-300")
        console.log(await intra.getModuleByUrl("/module/2021/B-PRO-300"));
    } catch (e) {
        console.log("Second error:")
        console.log(e);
    }

})();
