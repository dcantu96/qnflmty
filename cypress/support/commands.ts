import { trpcClient } from '~/lib/trpcClient'

Cypress.Commands.add('login', (email: string) => {
	cy.request({
		method: 'POST',
		url: '/api/cypress/login',
		body: { email },
	}).then((response) => {
		expect(response.status).to.eq(200)
		expect(response.body.sessionToken).to.exist
		cy.setCookie('next-auth.session-token', response.body.sessionToken)
	})
})

Cypress.Commands.add(
	'createUser',
	(user: { name: string; email: string; image?: string }) => {
		cy.request({
			method: 'POST',
			url: '/api/cypress/users',
			body: { ...user, admin: false },
		}).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body).to.exist
			expect(response.body.email).to.equal(user.email)
			expect(response.body.admin).to.be.false
			return response.body.email
		})
	},
)

Cypress.Commands.add('deleteUser', (emailOrId: string | number) => {
	const body =
		typeof emailOrId === 'string' ? { email: emailOrId } : { id: emailOrId }

	cy.request({
		method: 'DELETE',
		url: '/api/cypress/users',
		body,
	}).then((response) => {
		expect(response.status).to.eq(200)
		expect(response.body.success).to.be.true
		expect(response.body.message).to.exist
	})
})

Cypress.Commands.add(
	'createAdmin',
	(user: { name: string; email: string; image?: string }) => {
		cy.request({
			method: 'POST',
			url: '/api/cypress/users',
			body: { ...user, admin: true },
		}).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body).to.exist
			expect(response.body.email).to.equal(user.email)
			expect(response.body.admin).to.be.true
			return response.body.email
		})
	},
)
