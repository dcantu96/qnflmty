/**
 * Complete User Journey Tests
 * Sequential tests that build upon each other to test the complete user flow
 */
describe('Admin Journey', () => {
	const testAdmin = {
		name: 'John Wick',
		email: 'john@wick.com',
	}

	const username = 'johnwick'

	before(() => {
		cy.createAdmin(testAdmin)
	})

	after(() => {
		cy.deleteUser(testAdmin.email)
	})

	beforeEach(() => {
		cy.clearCookies()
		cy.login(testAdmin.email)
	})

	it('1. should redirect new users to profile creation', () => {
		cy.visit('/')
		cy.url().should('include', '/create-profile')
		cy.contains(/Create Your Profile/i)
		cy.contains(/Choose a username and avatar to get started with Qnflmty/i)
	})

	it('4. should create first profile successfully and skip request access screen', () => {
		cy.visit('/create-profile')

		cy.get('label')
			.contains(/Username/i)
			.parent()
			.find('input')
			.clear()
			.type(username)

		cy.get('label')
			.contains(/Rocket/i)
			.click()

		cy.get('button[type="submit"]')
			.contains(/Create Profile/i)
			.click()

		cy.url().should('include', '/dashboard')
	})
})
