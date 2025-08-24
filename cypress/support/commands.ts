Cypress.Commands.add('login', (email: string) => {
	cy.task('login', email).then((response) => {
		cy.setCookie('next-auth.session-token', response)
	})
})

Cypress.Commands.add('setProfileId', (email: string, username: string) => {
	cy.task('getUserAccountId', { email, username }).then((response) => {
		cy.setCookie('selectedProfile', response.toString())
	})
})
