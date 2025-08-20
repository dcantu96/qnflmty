/**
 * Landing Page Tests
 * Sequential tests that build upon each other to test the complete user flow
 */
describe('Landing Page', () => {
	beforeEach(() => {
		cy.clearCookies()
		cy.visit('/')
	})

	it('should show landing page for brand new users', () => {
		cy.url().should('include', '/')
		cy.contains(/Welcome to Qnflmty/i)
	})

	it('should redirect to login when pressing get started now', () => {
		cy.contains(/Get Started Now/i).click()
		cy.url().should('include', '/login')
	})

	it('should redirect to login if I try to go to /dashboard', () => {
		cy.visit('/dashboard')
		cy.url().should('include', '/login')
	})
})
