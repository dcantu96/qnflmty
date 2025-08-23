declare namespace Cypress {
	interface Chainable {
		login(email: string): Chainable<Element>
		task(event: 'login', params: LoginTaskParams): Chainable<string>
		task(event: 'createUser', params: CreateUserTaskParams): Chainable<null>
		task(event: 'deleteUser', params: DeleteUserTaskParams): Chainable<null>
		task(event: 'createAdmin', params: CreateAdminTaskParams): Chainable<null>
	}
}
