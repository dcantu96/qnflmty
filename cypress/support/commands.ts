Cypress.Commands.add('login', (email: string) => {
	cy.task('login', email).then((response) => {
		cy.setCookie('next-auth.session-token', response)
	})
})
