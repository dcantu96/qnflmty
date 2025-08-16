declare namespace Cypress {
	interface Chainable {
		login(email: string): Chainable<Element>
		createUser(user: { name: string; email: string }): Chainable<Element>
		deleteUser(email: string): Chainable<Element>
	}
}
