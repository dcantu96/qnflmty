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

	describe('Creating tournaments', () => {
		before(() => {
			cy.task('createSport', sport)
		})
		after(() => {
			cy.task('deleteTournament', { name: tournament.name }).then(() => {
				cy.task('deleteSport', { name: sport.name })
			})
		})

		it('Should create a new tournament', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/tournaments/i).click()
			cy.contains(/add tournament/i).click()
			cy.url().should('include', '/admin/tournaments/new')
			cy.get('input[name="name"]').type(tournament.name)
			cy.get('input[name="year"]').type(tournament.year.toString())
			cy.get('[name="sport"]').click()
			cy.contains('[role="option"]', sport.name).click()
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(tournament.name)
			cy.contains(tournament.year)
			cy.contains(sport.name)
		})

		it('Should not allow to create a duplicate tournament', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/tournaments/i).click()
			cy.contains(/add tournament/i).click()
			cy.get('input[name="name"]').type(tournament.name)
			cy.get('input[name="year"]').type(tournament.year.toString())
			cy.get('[name="sport"]').click()
			cy.contains('[role="option"]', sport.name).click()
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(/unique tournament already exists/i)
		})
	})

	describe('Editing tournaments', () => {
		before(() => {
			cy.task('createSport', sport).then(({ id }) => {
				cy.task('createTournament', {
					...tournament,
					sportId: id,
				})
			})
		})

		after(() => {
			cy.task('deleteTournament', { name: 'Champions League' }).then(() => {
				cy.task('deleteSport', { name: sport.name })
			})
		})

		it('Should edit an existing tournament', () => {
			cy.visit('/admin/tournaments')
			cy.contains(tournament.name).parent().find('button:has(svg)').click()
			cy.contains(/edit tournament/i).click()

			cy.get('input[name="name"]').clear().type('Champions League')
			cy.get('button')
				.contains(/update/i)
				.click()
			cy.contains('Champions League')
		})
	})

	describe('Deleting tournaments', () => {
		before(() => {
			cy.task('createSport', sport).then(({ id }) => {
				cy.task('createTournament', {
					...tournament,
					sportId: id,
				})
			})
		})

		after(() => {
			cy.task('deleteTournament', { name: tournament.name }).then(() => {
				cy.task('deleteSport', { name: sport.name })
			})
		})

		it('Should delete an existing tournament', () => {
			cy.visit('/admin/tournaments')
			cy.contains(tournament.name).parent().find('button:has(svg)').click()
			cy.contains(/delete tournament/i).click()
			cy.contains('Delete Tournament')
			cy.contains(
				`Are you sure you want to delete tournament: ${tournament.name}?`,
			)
				.parent()
				.parent()
				.find('button')
				.contains('Delete')
				.click()
			cy.contains(tournament.name).should('not.exist')
		})
	})
})
