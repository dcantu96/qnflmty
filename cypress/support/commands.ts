import { trpcClient } from '~/lib/trpcClient'

Cypress.Commands.add('login', (email: string) => {
	cy.wrap(trpcClient.cypressLogin.create.mutate({ email }), {
		timeout: 10000,
	}).then((res) => {
		const response = res as { sessionToken: string }
		expect(response.sessionToken).to.exist
		cy.setCookie('next-auth.session-token', response.sessionToken)
	})
})

Cypress.Commands.add('createUser', (user: { name: string; email: string }) => {
	cy.wrap(trpcClient.users.create.mutate(user), {
		timeout: 10000,
	}).then((res) => {
		const response = res as { email: string; name: string }
		expect(response).to.exist
		expect(response.email).to.equal(user.email)
		return response.email
	})
})

Cypress.Commands.add('deleteUser', (email: string) => {
	cy.wrap(trpcClient.users.byEmail.query({ email }), {
		timeout: 10000,
	})
		.then((res) => {
			const user = res as { id: number }
			if (!user || !user.id) {
				throw new Error(`User with email ${email} not found`)
			}
			return user.id
		})
		.then((id) => {
			return trpcClient.users.delete.mutate({ id })
		})
		.then((res) => {
			expect(res).to.exist
			expect(res.success).to.be.true
		})
})
