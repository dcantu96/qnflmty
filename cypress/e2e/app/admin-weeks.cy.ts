const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
}

const sport = {
	name: 'American Football',
}

const tournament = {
	name: 'National Football League',
	year: 2025,
}

describe('An Admin', () => {
	before(() => {
		cy.task('createAdmin', testAdmin)
	})

	after(() => {
		cy.task('deleteUser', testAdmin.email)
	})

	beforeEach(() => {
		cy.clearCookies()
		cy.login(testAdmin.email)
	})

	describe('Viewing tournament weeks', () => {
		let tournamentId: number | null = null
		before(() => {
			cy.task('createSport', sport).then((s) => {
				cy.task('createTournament', { ...tournament, sportId: s.id }).then(
					(t) => {
						tournamentId = t.id
					},
				)
			})
		})

		after(() => {
			tournamentId = null
			cy.task('deleteSport', { name: sport.name })
		})

		it('Should display no results if no weeks exist', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/tournaments/i).click()
			cy.contains(/name/i)
			cy.contains(tournament.name).click()
			cy.contains(/week number/i)
			cy.contains(/no results/i)
		})

		describe('With one week', () => {
			before(() => {
				cy.task('createWeek', { tournamentId, number: 1 })
			})

			it('Can view weeks', () => {
				cy.visit('/admin/tournaments')
				cy.contains(/name/i)
				cy.contains(tournament.name).click()
				cy.contains(/week number/i)
				cy.contains(/1/i)
			})
		})
	})
})
