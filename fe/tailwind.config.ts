
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				title: ['Poppins', 'sans-serif'],
				body: ['Poppins', 'sans-serif'],
				praise: ['Praise', 'cursive'],
				kaushan: ['Kaushan', 'cursive'],
				// ...other font families if needed
			  },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				urban: {
					black: '#0F0F0F',
					charcoal: '#1A1A1A',
					steel: '#2D2D2D',
					concrete: '#404040',
					silver: '#8B8B8B',
					white: '#F5F5F5',
					neon: '#00FF94',
					electric: '#00D4FF',
					orange: '#FF6B35',
					yellow: '#FFD23F'
				},
				salon: {
					black: '#2D2D2D',
					gold: '#D4AF37',
					beige: '#F5F2E8',
					white: '#FFFFFF'
				},
				primary: '#fed7aa', // Orange
				dark: '#27272a',    // Zinc-800
				neutral: '#262626', // Neutral-800
				light: '#ffffff',   // White
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						textShadow: '0 0 5px #00FF94, 0 0 10px #00FF94, 0 0 15px #00FF94, 0 0 20px #00FF94'
					},
					'50%': {
						textShadow: '0 0 2px #00FF94, 0 0 5px #00FF94, 0 0 8px #00FF94, 0 0 12px #00FF94'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite'
			},
			textShadow: {
				'urban-neon': '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0 0 5px #00FF94, 0 0 10px #00FF94, 0 0 15px #00FF94',
				'urban-electric': '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0 0 5px #00D4FF, 0 0 10px #00D4FF, 0 0 15px #00D4FF',
				'urban-glow': '2px 2px 4px rgba(0,0,0,0.8)'
			},
			backdropBlur: {
				'urban': '8px'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.text-shadow-urban-neon': {
					textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0 0 5px #00FF94, 0 0 10px #00FF94, 0 0 15px #00FF94'
				},
				'.text-shadow-urban-electric': {
					textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0 0 5px #00D4FF, 0 0 10px #00D4FF, 0 0 15px #00D4FF'
				},
				'.text-shadow-urban-glow': {
					textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
