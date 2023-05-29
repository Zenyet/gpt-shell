/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: { // 用于扩展原本的颜色，如 bg-1000 -> 将 1000: '#383838'
            colors: { // colors 如果定义在extend的外部，会导致原本的预设颜色都失效没有
                "ter-top": "#353534",
                "ter-border": "#777776",
                "triangle": "#0073cc"
            },
            animation: {
                breath: "breath 1s ease-in-out infinite"
            },
            keyframes: {
                breath: {
                    '0%': {opacity: 1},
                    '100%': {opacity: 0}
                }
            }
        },
    },
    plugins: [],
}

