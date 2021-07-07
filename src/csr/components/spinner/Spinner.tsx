import React from "react";
import './Spinner.css';

const Graphics = () => (
    <svg
        className='spinner-inner'
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid"
    >
        <title>Venter...</title>
        <circle
            xmlns="http://www.w3.org/2000/svg"
            cx="25"
            cy="25"
            r="20"
            stroke="#eee"
            fill="none"
            strokeWidth="5"
        />
        <circle
            cx="25"
            cy="25"
            r="20"
            stroke="#888"
            fill="none"
            strokeWidth="5"
            strokeDasharray="50 155"
            strokeLinecap="round"
        />
    </svg>
);

export const Spinner = () => {
    return (
        <div className={'spinner-outer'}>
            <Graphics />
        </div>
    );
}
