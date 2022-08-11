import { RawIntra } from "../";  // import { RawIntra } from "epitech.js";

(async function(){

    class Provider {
        refresh = async () => "{authentication cookie}";
    }

    const intra = new RawIntra({
        provider: new Provider()
    });

    const modules = await intra.filterCourses({});
    console.log(modules);
    const moduleItem = modules.items.find(m => m.code === "B-PRO-300");
    if (moduleItem === undefined)
        return;

    const moduleUrl = intra.solveModuleUrl({
        scolaryear: moduleItem.scolaryear,
        module: moduleItem.code,
        instance: moduleItem.codeinstance
    });

    const module = await intra.getModuleByUrl(moduleUrl);
    const projectActivities = module.activites.filter(acti => acti.is_projet);
    for (const projectActi of projectActivities) {
        const projectUrl = intra.solveProjectUrl({
            scolaryear: module.scolaryear,
            module: module.codemodule,
            instance: module.codeinstance,
            activity: projectActi.codeacti
        });

        const projectFiles = await intra.getProjectFilesByUrl(projectUrl);
        console.log(projectFiles);
    }
})();
