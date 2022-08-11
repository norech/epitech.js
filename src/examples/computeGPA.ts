import { RawIntra } from "..";  // import { RawIntra } from "epitech.js";

(async function(){

    class Provider {
        refresh = async () => "{authentication cookie}";
    }

    const intra = new RawIntra({
        provider: new Provider()
    });

    const user = await intra.getUser();
    const details = await intra.getUserDetails(user.login);

    const gradeMapping = {
        "Acquis": -1,
        "A": 4,
        "B": 3,
        "C": 2,
        "D": 1,
        "E": 0,
        "Echec": 0,
        "-": -2
    };

    let grades = details.modules.map(module => {
        const grade = module.grade || "-";

        return {
            module: module.codemodule,
            grade: gradeMapping[grade],
            credits: +module.credits
        };
    });

    grades = grades.filter(module => module.grade >= 0);

    grades = grades.filter(module => module.credits > 0);

    const credits = grades.reduce((acc, module) => acc + module.credits, 0);

    console.log(grades);

    const gpa = grades.map(module => module.credits * module.grade).reduce((a, b) => a + b, 0) / credits;

    console.log("Computed:", "GPA: " + gpa.toFixed(2), "Credits: " + credits);
    console.log("Intranet:", "GPA: " + user.gpa[0].gpa, "Credits: " + user.credits);

})();
