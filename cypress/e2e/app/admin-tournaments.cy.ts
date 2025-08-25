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

	it('Can view all tournaments', () => {
		cy.visit('/admin')
		cy.contains(/data/i).click()
		cy.contains(/tournaments/i).click()
		cy.url().should('include', '/admin/tournaments')
		cy.contains(/tournaments/i)
		cy.contains(/national football league/i)
	})
})
