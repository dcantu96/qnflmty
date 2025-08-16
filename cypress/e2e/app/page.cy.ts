describe('Authenticated Dashboard', () => {
	beforeEach(() => {
		cy.login('davidcantu966@gmail.com')
	})

	it('should display the dashboard for the signed-in user', () => {
		cy.visit('/')
		cy.contains('Hello, QNFLMTY in progress')
		cy.contains('Hello David Cantu')
		cy.contains('Your accounts: davidcantum, prueba123[]')
	})
})
