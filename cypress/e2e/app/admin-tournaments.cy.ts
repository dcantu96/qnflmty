/**
 * An admin
 * Can view all tournaments
 * Can create new tournaments
 * Can edit tournaments
 * Can delete tournaments
 */

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

	describe('Viewing tournaments', () => {
		it('Should display no results if no tournaments exist', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/tournaments/i).click()
			cy.contains(/name/i)
			cy.contains(/year/i)
			cy.contains(/sport/i)
			cy.contains(/no results/i)
		})

		describe('With one tournament', () => {
			before(() => {
				cy.task('createSport', sport).then(({ id }) => {
					cy.task('createTournament', {
						...tournament,
						sportId: id,
					})
				})
			})

			after(() => {
				cy.task('deleteTournament', { name: tournament.name })
				cy.task('deleteSport', { name: sport.name })
			})

			it('Can view tournaments', () => {
				cy.visit('/admin')
				cy.contains(/data/i).click()
				cy.contains(/tournaments/i).click()
				cy.url().should('include', '/admin/tournaments')
				cy.contains(/tournaments/i)
				cy.contains(tournament.name)
				cy.contains(tournament.year)
				cy.contains(sport.name)
			})
		})
	})
})
