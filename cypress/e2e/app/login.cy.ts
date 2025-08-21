const testUser = {
	name: 'Journey Test User',
	email: 'journey-test@example.com',
}

describe('Login page accessibility', () => {
	before(() => {
		cy.createUser(testUser)
	})
	after(() => {
		cy.deleteUser(testUser.email)
	})

	it('Should display proper login page elements', () => {
		cy.visit('/login')

		// Check for proper page title and content
		cy.contains(/Welcome back/i).should('be.visible')

		// Should have Google OAuth button
		cy.get('button')
			.contains(/Login with Google/i)
			.should('be.visible')

		// Should have proper branding
		cy.get('img[alt="QNFLMTY Logo"]').should('be.visible')
	})

	it('Should handle login page when already authenticated', () => {
		// First login
		cy.login(testUser.email)

		// Then try to access login page
		cy.visit('/login')

		// Should be redirected away from login page since already authenticated
		cy.url().should('not.include', '/login')
	})
})
