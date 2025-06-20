import type { Config } from "tailwindcss";

export default {
	darkMode: "media",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
	],
	theme: {
		extend: {
			keyframes: {
				pulseSpinner: {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.3)', opacity: '0.5' },
				},
			},
			animation: {
				pulseSpinner: 'pulseSpinner 1s infinite',
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				maincolor: '#646cff',
				maindarkcolor: '#4952fe',
			},
			boxShadow: {
				'glow-main': '0 0 15px rgba(100, 108, 255, 0.6)', // maincolor를 활용한 glow 효과
				'glow-main-lg': '0 0 25px rgba(255, 99, 71, 0.8)', // 더 강한 glow 효과
			},
		},
	},
	plugins: [],
} satisfies Config;
