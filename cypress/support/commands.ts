Cypress.Commands.add('login', (email: string) => {
	cy.request('POST', '/api/test-login', { email }).then((res) => {
		const sessionToken = res.body.sessionToken as string
		cy.setCookie('next-auth.session-token', sessionToken)
	})
})
