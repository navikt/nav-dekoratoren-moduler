import React from "react";

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

const style = '.spinner-outer {\n' +
    '    display: flex;\n' +
    '    justify-content: center;\n' +
    '    align-items: center;\n' +
    '    height: 35rem;\n' +
    '    width: 100%;\n' +
    '}\n' +
    '\n' +
    '.spinner-inner {\n' +
    '    display: inline-block;\n' +
    '    position: relative;\n' +
    '    animation: spinner-rotate 1.4s linear infinite;\n' +
    '\n' +
    '    height: 64px;\n' +
    '    width: 64px;\n' +
    '    background-size: 64px 64px;\n' +
    '}\n' +
    '\n' +
    '.spinner-inner circle:nth-child(3) {\n' +
    '    animation: spinner-dasharray 1.4s ease-in-out infinite;\n' +
    '    stroke-dasharray: 80px, 200px;\n' +
    '    stroke-dashoffset: 0;\n' +
    '}\n' +
    '\n' +
    '@keyframes spinner-rotate {\n' +
    '    100% {\n' +
    '        transform: rotate(360deg);\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    '@keyframes spinner-dasharray {\n' +
    '    0% {\n' +
    '        stroke-dasharray: 1px, 200px;\n' +
    '        stroke-dashoffset: 0;\n' +
    '    }\n' +
    '    50% {\n' +
    '        stroke-dasharray: 100px, 200px;\n' +
    '        stroke-dashoffset: -15px;\n' +
    '    }\n' +
    '    100% {\n' +
    '        stroke-dasharray: 100px, 200px;\n' +
    '        stroke-dashoffset: -120px;\n' +
    '    }\n' +
    '}'

export const Spinner = () => {
    return (
        <div className={'spinner-outer'}>
            <style>
                {style}
            </style>
            <Graphics />
        </div>
    );
}
