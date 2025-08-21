// without a session
// - should land on the landing page
// - should be able to navigate to profile creation
// - should be redirected to login in case of unauthorized access
// - should be able to login

describe('Users without session', () => {
	describe('Landing on the site', () => {
		it('Should land on the landing page', () => {
			cy.visit('/')
			cy.contains(/Welcome to Qnflmty/i).should('be.visible')
			cy.contains(/Get Started/i).should('be.visible')
		})
	})

	describe('Navigation attempts', () => {
		it('Should be able to navigate to login from landing page', () => {
			cy.visit('/')

			// Look for a "Get Started" or similar button that would lead to signup/profile creation
			cy.contains(/Get Started Now/i).click()

			// Should be redirected to login page first (since no session)
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
			cy.get('button')
				.contains(/Login with Google/i)
				.should('be.visible')
		})
	})

	describe('Unauthorized access protection', () => {
		it('Should be redirected to login when accessing protected dashboard route', () => {
			cy.visit('/dashboard')

			// Should be redirected to login
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
		})

		it('Should be redirected to login when accessing profile creation route', () => {
			cy.visit('/create-profile')

			// Should be redirected to login
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
		})

		it('Should be redirected to login when accessing profile selection route', () => {
			cy.visit('/select-profile')

			// Should be redirected to login
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
		})

		it('Should be redirected to login when accessing admin routes', () => {
			cy.visit('/admin')

			// Should be redirected to login
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
		})

		it('Should be redirected to login when accessing request access route', () => {
			cy.visit('/request-access/testuser')

			// Should be redirected to login
			cy.url().should('include', '/login')
			cy.contains(/Welcome back/i).should('be.visible')
		})
	})
})
