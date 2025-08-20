declare namespace Cypress {
	interface Chainable {
		login(email: string): Chainable<Element>
		createUser(user: { name: string; email: string }): Chainable<Element>
		deleteUser(email: string): Chainable<Element>
		createAdmin(admin: { name: string; email: string }): Chainable<Element>
		deleteAdmin(email: string): Chainable<Element>
	}
}
