import React from "react";
import Ikoner from "nav-frontend-ikoner-assets/lib";
import './Spinner.css';

export const Spinner = () => {
    return (
        <div className={'spinner-outer'}>
            <Ikoner kind={"spinner-negativ"} className={'spinner-inner'}/>
        </div>
    );
}
