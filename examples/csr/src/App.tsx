// @ts-ignore
import React from "react";
import { useState } from "react";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler";
import { setParams } from "@navikt/nav-dekoratoren-moduler";

const App = () => {
    const initalParams = { simple: true };
    const [error, setError] = useState();
    const [localParams, setLocalParams] = useState<string>(JSON.stringify(initalParams, null, 2));
    const [activeLanguage, setActiveLanguage] = useState("nb");

    onBreadcrumbClick((breadcrumb) => {
        console.log(breadcrumb);
    });

    onLanguageSelect((language) => {
        console.log(`Active language: ${activeLanguage}`);
        console.log(`Selected language: ${language.locale}`);
        setActiveLanguage(language.locale);
    });

    const onParamChange = () => {
        try {
            const params = JSON.parse(localParams);
            setParams(params);
        } catch (error: any) {
            console.log(error.message);
            setError(error);
        }
    };

    return (
        <div className={"testapp__container"}>
            <div>Test app</div>
            <div>
                <textarea
                    value={localParams}
                    className={"testapp__textarea"}
                    placeholder={"params"}
                    onChange={(e) => setLocalParams(e.target?.value)}
                />
            </div>
            <div>{error}</div>
            <div>
                <button onClick={() => onParamChange()}>Sett params</button>
            </div>
        </div>
    );
};

export default App;
