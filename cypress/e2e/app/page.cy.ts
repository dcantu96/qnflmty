describe('Authenticated Dashboard', () => {
	beforeEach(() => {
		cy.login('davidcantu966@gmail.com')
	})

	it('should display the dashboard for the signed-in user', () => {
		cy.visit('/')
		cy.contains('Hello, QNFLMTY in progress')
		cy.contains('Hello David Cantu')
		cy.contains('Your accounts: davidcantum, prueba123')
	})
})

/**
 * UI for brand new users
 * Layout: No sidebar, full page view
 *   - welcome message
 *   - what's next section
 *   - Group Info section
 */
describe('New Users', () => {
	before(() => {
		cy.createUser({
			name: 'New User',
			email: 'new-user@test.io',
		})
		cy.login('new-user@test.io')
	})

	after(() => {
		cy.deleteUser('new-user@test.io')
		cy.visit('/')
		cy.contains('Welcome back')
	})

	it('should display the welcome message for new users', () => {
		cy.visit('/')
		cy.contains('Hello, QNFLMTY in progress')
		// cy.contains("What's next?")
		// cy.contains('Group Info')
	})
})
