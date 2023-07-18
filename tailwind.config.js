/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        prefix: 'daisy-',
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["[data-theme=light]"],
                    "primary": "#a96dd8",
                    ".daisy-modal-box": {
                        "background-color": "#fff",
                    }
                }
            },
            {
                dark: {
                    ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
                    "primary": "#a96dd8",
                    ".daisy-modal-box": {
                        "background-color": "#1e1e1e",
                    }
                }
            },
        ],
    },
}

