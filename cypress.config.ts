import { defineConfig } from 'cypress'
import {
	createUser,
	login,
	deleteUser,
	createAdmin,
	getUserAccountId,
	createSport,
	createTournament,
	deleteSport,
	deleteTournament,
	createGroup,
	deleteGroup,
	createTeam,
	deleteTeam,
	createWeek,
} from './cypress/tasks'

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
				getUserAccountId: getUserAccountId(dbUrl),
				createSport: createSport(dbUrl),
				deleteSport: deleteSport(dbUrl),
				createTournament: createTournament(dbUrl),
				deleteTournament: deleteTournament(dbUrl),
				createGroup: createGroup(dbUrl),
				deleteGroup: deleteGroup(dbUrl),
				createTeam: createTeam(dbUrl),
				deleteTeam: deleteTeam(dbUrl),
				createWeek: createWeek(dbUrl),
			})

			return cypressConfig
		},
	},
})
