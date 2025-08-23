const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
}
const username = 'john-wick'

describe('Login, Redirects and Profile Creation', () => {
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

		describe('Without a profile', () => {
			it('Should redirect straight to the admin dashboard', () => {
				cy.visit('/')
				cy.url().should('include', '/admin')
				cy.contains(/Admin/i)
			})
			it('Can create a profile', () => {
				cy.visit('/')
				cy.contains(/No Profile Selected/i).click()
				cy.contains(/Add Profile/i).click()
				cy.url().should('include', '/create-profile')
				cy.contains(/Create Profile/i)
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

				cy.contains(/Dashboard/i)
				cy.contains(username)
			})
		})

		describe('With at least one profile', () => {
			describe('None selected', () => {
				it('Should redirect to the select profile', () => {
					cy.login(testAdmin.email)
					cy.visit('/')
					cy.url().should('include', '/select-profile')
					cy.contains(/Who's playing?/i)
					cy.contains(username).click()
					cy.contains(/Dashboard?/i)
				})
			})
		})
	})
})
