import { defineConfig } from 'cypress'

export default defineConfig({
	projectId: 'wxjaty',
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: ['cypress/e2e/**/*.cy.{js,ts}', 'app/**/*.test.ts'],
	},
})
