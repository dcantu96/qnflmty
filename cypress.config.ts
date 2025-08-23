import { defineConfig } from 'cypress'
import { createUser, login, deleteUser, createAdmin } from './cypress/tasks'

export default defineConfig({
	projectId: 'wxjaty',
	e2e: {
		baseUrl: 'http://localhost:3000',
		specPattern: ['cypress/e2e/**/*.cy.{js,ts}', 'app/**/*.test.ts'],
		setupNodeEvents(on, cypressConfig) {
			const dbUrl = cypressConfig.env.DATABASE_URL

			on('task', {
				login: login(dbUrl),
				createUser: createUser(dbUrl),
				deleteUser: deleteUser(dbUrl),
				createAdmin: createAdmin(dbUrl),
			})

			return cypressConfig
		},
	},
})
