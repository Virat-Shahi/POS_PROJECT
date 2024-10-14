export function TableIcon(props) {
    return (
        <svg
            width="256px"
            height="256px"
            viewBox="0 0 24.00 24.00"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000"
            {...props}
        >
            <g id="SVGRepo_iconCarrier">
                <defs>
                    <style>
                        {
                            ".cls-1{fill:none;stroke:#a31919;stroke-miterlimit:10;stroke-width:1.512}"
                        }
                    </style>
                </defs>
                <path className="cls-1" d="M1.5 6.32H22.5V10.14H1.5z" />
                <path
                    className="cls-1"
                    d="M4.36 19.68L2.46 19.68 4.36 10.14 8.18 10.14 4.36 19.68z"
                />
                <path
                    className="cls-1"
                    d="M19.64 19.68L21.55 19.68 19.64 10.14 15.82 10.14 19.64 19.68z"
                />
                <path className="cls-1" d="M6.27 14.91L17.73 14.91" />
            </g>
        </svg>
    )
}

export function Guests(props) {
    return (
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                className="clr-i-solid clr-i-solid-path-1"
                d="M12 16.14h-.87a8.67 8.67 0 00-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62.25-.29a11 11 0 014.71-2.86A6.59 6.59 0 0112 16.14z"
            />
            <path
                className="clr-i-solid clr-i-solid-path-2"
                d="M31.34 18.63a8.67 8.67 0 00-6.43-2.52 10.47 10.47 0 00-1.09.06 6.59 6.59 0 01-2 2.45 10.91 10.91 0 015 3l.25.28.54.62v4.71h3.94v-8.32z"
            />
            <path
                className="clr-i-solid clr-i-solid-path-3"
                d="M11.1 14.19h.31a6.45 6.45 0 013.11-6.29 4.09 4.09 0 10-3.42 6.33z"
            />
            <path
                className="clr-i-solid clr-i-solid-path-4"
                d="M24.43 13.44a6.54 6.54 0 010 .69 4.09 4.09 0 00.58.05h.19A4.09 4.09 0 1021.47 8a6.53 6.53 0 012.96 5.44z"
            />
            <circle
                className="clr-i-solid clr-i-solid-path-5"
                cx={17.87}
                cy={13.45}
                r={4.47}
            />
            <path
                className="clr-i-solid clr-i-solid-path-6"
                d="M18.11 20.3A9.69 9.69 0 0011 23l-.25.28v6.33a1.57 1.57 0 001.6 1.54h11.49a1.57 1.57 0 001.6-1.54V23.3l-.24-.3a9.58 9.58 0 00-7.09-2.7z"
            />
            <path fillOpacity={0} d="M0 0H36V36H0z" />
        </svg>
    )
}