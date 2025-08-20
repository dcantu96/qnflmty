/**
 * Complete User Journey Tests
 * Sequential tests that build upon each other to test the complete user flow
 */
describe('Admin Journey', () => {
	const testAdmin = {
		name: 'John Wick',
		email: 'john@wick.com',
	}

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

	it('1. admins without a profile should redirect straight to the admin dashboard', () => {
		cy.visit('/')
		cy.url().should('include', '/admin')
		cy.contains(/Admin/i)
	})

	it('2. admins with existing profiles should be redirected to the regular dashboard', () => {
		cy.visit('/')
		cy.url().should('include', '/dashboard')
		cy.contains(/Dashboard/i)
	})

	it('3. admin without a profile can navigate to create a profile', () => {
		cy.visit('/')
		// press the user icon then navigate to user dashboard
	})
})
