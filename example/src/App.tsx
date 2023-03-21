// @ts-ignore
import React from "react";
import { useState } from "react";
import { EnforceLoginLoader, Auth } from "@navikt/nav-dekoratoren-moduler";
import { onLanguageSelect } from "@navikt/nav-dekoratoren-moduler";
import { setAvailableLanguages } from "@navikt/nav-dekoratoren-moduler";
import { onBreadcrumbClick } from "@navikt/nav-dekoratoren-moduler";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { setParams } from "@navikt/nav-dekoratoren-moduler";

const App = () => {
    const initalParams = { simple: true };
    const [error, setError] = useState();
    const [localParams, setLocalParams] = useState<string>(
        JSON.stringify(initalParams, null, 2)
    );
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
        } catch (error) {
            console.log(error.message);
            setError(error);
        }
    };

    const authCallback = (auth: Auth) => {
        console.log(auth);
        setBreadcrumbs([
            {
                title: "Ditt nav",
                url: "https://www.nav.no/person/dittnav",
                handleInApp: true,
            },
            {
                title: "Kontakt oss",
                url: "https://www.nav.no/person/kontakt-oss",
                handleInApp: true,
            },
        ]);
        setAvailableLanguages([
            {
                locale: "nb",
                url: "https://www.nav.no/no/person",
                handleInApp: true,
            },
            {
                locale: "en",
                url: "https://www.nav.no/en/person",
                handleInApp: true,
            },
        ]);
    };

    // console.log(header);

    return (
        <EnforceLoginLoader authCallback={authCallback}>
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
        </EnforceLoginLoader>
    );
};

export default App;
