const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
	phone: '555-555-5555',
}

const sportMock = {
	name: 'American Football',
	tournaments: [
		{
			name: 'NFL',
			year: 2018,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2018-05-01T00:00:00.000Z',
				paymentDueDate: '2024-10-19T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2019,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2019-05-15T00:00:00.000Z',
				paymentDueDate: '2024-10-21T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2020,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2020-05-20T00:00:00.000Z',
				paymentDueDate: '2024-10-17T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2021,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2021-05-25T00:00:00.000Z',
				paymentDueDate: '2024-10-15T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2022,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2022-05-04T00:00:00.000Z',
				paymentDueDate: '2024-10-13T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2023,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2023-05-09T00:00:00.000Z',
				paymentDueDate: '2024-10-11T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2024,
			group: {
				name: 'QNFLMTY',
				joinable: false,
				finished: true,
				createdAt: '2024-05-14T00:00:00.000Z',
				paymentDueDate: '2024-10-09T00:00:00.000Z',
			},
		},
		{
			name: 'NFL',
			year: 2025,
			group: {
				name: 'QNFLMTY',
				joinable: true,
				finished: false,
				createdAt: '2025-05-19T00:00:00.000Z',
				paymentDueDate: '2025-10-19T00:00:00.000Z',
			},
		},
	],
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

	it('should be able to navigate to groups list', () => {
		cy.visit('/admin')
		cy.contains(/groups/i).click()
		cy.url().should('include', '/admin/groups')
	})

	describe('Viewing Groups', () => {
		before(() => {
			const { tournaments, ...sport } = sportMock
			cy.task('createSport', sport).then(({ id }) => {
				for (const { group, ...tournament } of tournaments) {
					cy.task('createTournament', { sportId: id, ...tournament }).then(
						({ id }) => {
							cy.task('createGroup', { tournamentId: id, ...group })
						},
					)
				}
			})
		})

		after(() => {
			cy.task('deleteSport', sportMock.name)
		})

		it('should display the group details', () => {
			cy.visit('/admin/groups')
			cy.contains(/name/i)
			cy.contains(/tournament/i)
			cy.contains(/joinable/i)
			cy.contains(/payment due/i)
			cy.contains(/created at/i)
			cy.get('input[placeholder="Filter Groups..."]').type('QNFLMTY')
			cy.contains('QNFLMTY')
		})
	})
})
