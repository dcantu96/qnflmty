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

	describe('Viewing sports', () => {
		it('Should display no results if no sports exist', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/sports/i).click()
			cy.contains(/name/i)
			cy.contains(/no results/i)
		})

		describe('With one sport', () => {
			before(() => {
				cy.task('createSport', sport)
			})

			after(() => {
				cy.task('deleteSport', { name: sport.name })
			})

			it('Can view sports', () => {
				cy.visit('/admin')
				cy.contains(/data/i).click()
				cy.contains(/sports/i).click()
				cy.url().should('include', '/admin/sports')
				cy.contains(/sports/i)
				cy.contains(sport.name)
			})
		})
	})

	describe('Creating sports', () => {
		after(() => {
			cy.task('deleteSport', { name: sport.name })
		})

		it('Should create a new sport', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/sports/i).click()
			cy.contains(/add sport/i).click()
			cy.url().should('include', '/admin/sports/new')
			cy.get('input[name="name"]').type(sport.name)
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(sport.name)
		})

		it('Should not allow to create a duplicate sport', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/sports/i).click()
			cy.contains(/add sport/i).click()
			cy.get('input[name="name"]').type(sport.name)
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(/unique sport already exists/i)
		})
	})

	describe('Editing sports', () => {
		before(() => {
			cy.task('createSport', sport)
		})

		after(() => {
			cy.task('deleteSport', { name: 'Basketball' })
		})

		it('Should edit an existing sport', () => {
			cy.visit('/admin/sports')
			cy.contains(sport.name).parent().find('button:has(svg)').click()
			cy.contains(/edit sport/i).click()

			cy.get('input[name="name"]').clear().type('Basketball')
			cy.get('button')
				.contains(/update/i)
				.click()
			cy.contains('Basketball')
		})
	})

	describe('Deleting sports', () => {
		before(() => {
			cy.task('createSport', sport)
		})

		it('Should delete an existing sport', () => {
			cy.visit('/admin/sports')
			cy.contains(sport.name).parent().find('button:has(svg)').click()
			cy.contains(/delete sport/i).click()
			cy.contains('Delete Sport')
			cy.contains(`Are you sure you want to delete sport: ${sport.name}?`)
				.parent()
				.parent()
				.find('button')
				.contains('Delete')
				.click()
			cy.contains(sport.name).should('not.exist')
		})
	})
})
