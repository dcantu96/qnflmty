describe('Authenticated Dashboard', () => {
	beforeEach(() => {
		cy.login('davidcantu966@gmail.com')
	})

	it('should display the dashboard for the signed-in user', () => {
		cy.visit('/')
		cy.contains('Hello, QNFLMTY in progress')
		cy.contains('Hello Guest')
		cy.get('button').contains('Log in').click()
		cy.contains('Hello User')
		cy.contains('Your user ID is: 123')
		cy.contains('Your accounts: example_account')
		cy.get('button').contains('Log out').click()
		cy.contains('Hello Guest')
	})
})
