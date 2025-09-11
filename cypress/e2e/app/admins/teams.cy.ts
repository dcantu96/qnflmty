const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
}

const sport = {
	name: 'American Football',
}

const team = {
	name: 'New England Patriots',
	shortName: 'NE',
}
const team2 = {
	name: 'Buffalo Bills',
	shortName: 'BUF',
}
const team3 = {
	name: 'Miami Dolphins',
	shortName: 'MIA',
}

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

	describe('Viewing sport teams', () => {
		describe('With no teams', () => {
			before(() => {
				cy.task('createSport', sport)
			})
			after(() => {
				cy.task('deleteSport', { name: sport.name })
			})

			it('Should display no teams', () => {
				cy.visit('/admin')
				cy.contains(/data/i).click()
				cy.contains(/sports/i).click()
				cy.contains(/name/i)
				cy.contains(/teams/i)
				cy.contains(sport.name)
				cy.get('a').find('svg.lucide-flag')
			})
		})

		describe('With three team', () => {
			before(() => {
				cy.task('createSport', sport).then(({ id }) => {
					cy.task('createTeam', { ...team, sportId: id })
					cy.task('createTeam', { ...team2, sportId: id })
					cy.task('createTeam', { ...team3, sportId: id })
				})
			})

			after(() => {
				cy.task('deleteSport', { name: sport.name })
			})

			it('Can view sport teams', () => {
				cy.visit('/admin')
				cy.contains(/data/i).click()
				cy.contains(/sports/i).click()
				cy.contains(/name/i)
				cy.contains(/teams/i)
				cy.contains(sport.name)
				cy.get('a').contains('svg.lucide-flag').should('not.exist')
				cy.get(`img[alt="${team.name}"]`).should('exist')
			})
		})
	})

	describe('Creating teams', () => {
		before(() => {
			cy.task('createSport', sport)
		})
		after(() => {
			cy.task('deleteSport', { name: sport.name })
		})

		it('Should create a new team', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/sports/i).click()
			cy.get('table')
				.contains(sport.name)
				.parent()
				.within(() => {
					cy.get('a[title="View Teams"]').click()
				})
			cy.contains(/sports/i)
			cy.contains(sport.name)
			cy.contains(/add team/i).click()
			cy.get('input[name="name"]').type(team.name)
			cy.get('input[name="shortName"]').type(team.shortName)
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(team.name)
			cy.contains(team.shortName)
		})

		it('Should not allow to create a duplicate team', () => {
			cy.visit('/admin')
			cy.contains(/data/i).click()
			cy.contains(/sports/i).click()
			cy.contains(sport.name)
			cy.get(`img[alt="${team.name}"]`).click()
			cy.contains(/sports/i)
			cy.contains(sport.name)
			cy.contains(/add team/i).click()
			cy.get('input[name="name"]').type(team.name)
			cy.get('input[name="shortName"]').type(team.shortName)
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.contains(/a team with this name already exists/i)
		})
	})
})
