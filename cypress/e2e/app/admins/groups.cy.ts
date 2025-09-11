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
				paymentDueDate: '2018-10-19T00:00:00.000Z',
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
				paymentDueDate: '2019-10-21T00:00:00.000Z',
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
				paymentDueDate: '2020-10-17T00:00:00.000Z',
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
				paymentDueDate: '2021-10-15T00:00:00.000Z',
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
				paymentDueDate: '2022-10-13T00:00:00.000Z',
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
				paymentDueDate: '2023-10-11T00:00:00.000Z',
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
				paymentDueDate: '2025-10-18T20:30:00.000Z',
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

	// Helper function to navigate to edit page for a group
	const editGroup = (groupName: string) => {
		cy.get('table')
			.contains(groupName)
			.parents('tr')
			.find('button[title="Group Actions"]')
			.click()
		cy.contains('Edit Group').click()
		cy.url().should('match', /\/admin\/groups\/\d+\/edit$/)
	}

	it('should be able to navigate to groups list', () => {
		cy.visit('/admin')
		cy.contains(/groups/i).click()
		cy.url().should('include', '/admin/groups')
		cy.get('table').contains('No results.')
	})

	describe('Viewing Groups', () => {
		before(() => {
			const { tournaments, ...sport } = sportMock
			cy.task('createSport', sport).then((s) => {
				for (const { group, ...tournament } of tournaments) {
					cy.task('createTournament', { sportId: s.id, ...tournament }).then(
						(t) => {
							cy.task('createGroup', { tournamentId: t.id, ...group })
						},
					)
				}
			})
		})

		after(() => {
			cy.task('deleteSport', { name: sportMock.name })
		})

		it('should display the active groups', () => {
			cy.visit('/admin/groups')
			cy.contains(/name/i)
			cy.contains(/tournament/i)
			cy.contains(/joinable/i)
			cy.contains(/payment due/i)
			cy.contains(/created at/i)
			cy.get('table').contains('QNFLMTY')
		})

		it('should be able to filter by finished groups', () => {
			cy.visit('/admin/groups')
			cy.get('a').contains('Finished').click()
			cy.get('table').contains('No results.').should('not.exist')
			cy.get('table tbody tr').should('have.length', 7)
		})

		it('should be able to navigate to tournament details from the list', () => {
			cy.visit('/admin/groups')
			cy.get('table').contains('NFL 2025').click()
			cy.get('main').contains('Tournaments')
			cy.contains('NFL')
			cy.contains('2025')
			cy.contains('American Football')
		})

		it('can bulk set groups as active', () => {
			cy.visit('/admin/groups')
			cy.get('a').contains('Finished').click()
			cy.get('table')
				.contains('NFL 2020')
				.should('be.visible')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('table')
				.contains('NFL 2021')
				.should('be.visible')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('button[title="Bulk Activate"]').click()
			cy.contains('Are you sure you want to activate these 2 groups?').should(
				'exist',
			)
			cy.get('button').contains('Activate').click()
			cy.get('table').contains('NFL 2020').should('not.exist')
			cy.get('table').contains('NFL 2021').should('not.exist')
			cy.get('a').contains('Active').click()
			cy.get('table').contains('NFL 2020').should('be.visible')
			cy.get('table').contains('NFL 2021').should('be.visible')
		})

		it('can bulk set groups as finished', () => {
			cy.visit('/admin/groups')
			cy.get('table')
				.contains('NFL 2025')
				.should('be.visible')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('button[title="Bulk Finish"]').click()
			cy.contains('Are you sure you want to finish these 1 groups?').should(
				'exist',
			)
			cy.get('button').contains('Finish').click()
			cy.get('table').contains('NFL 2025').should('not.exist')
			cy.get('a').contains('Finished').click()
			cy.get('table').contains('NFL 2025').should('be.visible')
		})

		it('can toggle groups joinable status', () => {
			cy.visit('/admin/groups')
			cy.get('a').contains('Finished').click()
			cy.get('table')
				.contains('NFL 2024')
				.should('be.visible')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('button[title="Bulk Joinable"]').click()
			cy.contains(
				'What should the joinable status be for these groups?',
			).should('exist')
			cy.get('label').contains('Joinable').click()
			cy.get('button').contains('Update').click()
			cy.get('table').contains('NFL 2024').should('exist')
			cy.get('table').contains('NFL 2024').parents('tr').contains('Joinable')
			cy.get('table')
				.contains('NFL 2024')
				.should('be.visible')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('button[title="Bulk Joinable"]').click()
			cy.get('label').contains('Joinable')
			cy.get('button').contains('Update').click()
			cy.get('table')
				.contains('NFL 2024')
				.parents('tr')
				.contains('Joinable')
				.should('not.exist')
		})
	})

	describe('Creating a Group', () => {
		before(() => {
			const { tournaments, ...sport } = sportMock
			cy.task('createSport', {
				...sport,
				tournaments: tournaments.map(({ group, ...tournament }) => tournament),
			})
		})

		after(() => {
			cy.task('deleteSport', { name: sportMock.name })
		})

		it('should be able to create a new group', () => {
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.url().should('include', '/admin/groups/new')
			cy.get('input[name="name"]').type('Masters League')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2025').click()
			cy.get('button[type="button"]').contains('Select date').click()
			cy.get('[role="dialog"]').should('be.visible')
			cy.get('[role="dialog"]').within(() => {
				cy.get('select').first().select('Oct')
				cy.get('select').last().select('2025')
				cy.get('button').contains('20').click()
			})
			cy.get('label').contains('Joinable').click()
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.url().should('include', '/admin/groups/')
			cy.contains('Masters League')
				.should('be.visible')
				.parents('tr')
				.within(() => {
					cy.contains('NFL 2025')
					cy.contains('Joinable')
					cy.contains('Oct 20, 2025')
				})
		})
		it('can create a new finished group', () => {
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.url().should('include', '/admin/groups/new')
			cy.get('input[name="name"]').type('Legends League')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2024').click()
			cy.get('label').contains('Finished').click()
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.url().should('include', '/admin/groups/')
			cy.get('a').contains('Finished').click()
			cy.contains('Legends League')
				.should('be.visible')
				.parents('tr')
				.within(() => {
					cy.contains('NFL 2024')
				})
		})

		it('should prevent creating duplicate groups with same name and tournament', () => {
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.url().should('include', '/admin/groups/new')
			cy.get('input[name="name"]').type('Masters League')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2025').click()
			cy.get('button')
				.contains(/create/i)
				.click()

			// Should show error message and stay on the form
			cy.contains(
				'A group with this name already exists for this tournament',
			).should('be.visible')
			cy.url().should('include', '/admin/groups/new')

			// Verify the original group still exists and no duplicate was created
			cy.visit('/admin/groups')
			cy.get('table tbody tr')
				.contains('Masters League')
				.should('have.length', 1)
		})

		it('should allow creating groups with same name but different tournaments', () => {
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.url().should('include', '/admin/groups/new')
			cy.get('input[name="name"]').type('Masters League')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2024').click()
			cy.get('button')
				.contains(/create/i)
				.click()
			cy.url().should('include', '/admin/groups/')

			// Verify both groups exist - one for 2024 and one for 2025
			cy.get('table').contains('Masters League').should('be.visible')
			cy.get('a').contains('Finished').click()
			cy.get('table').contains('Masters League').should('be.visible')
		})

		it('should validate group name is required', () => {
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.url().should('include', '/admin/groups/new')
			// Don't enter a name
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2025').click()
			cy.get('button')
				.contains(/create/i)
				.click()

			// Should show validation error and stay on form
			cy.url().should('include', '/admin/groups/new')
		})
	})

	describe('Editing a Group', () => {
		before(() => {
			const { tournaments, ...sport } = sportMock
			cy.task('createSport', sport).then((s) => {
				for (const { group, ...tournament } of tournaments) {
					cy.task('createTournament', { sportId: s.id, ...tournament }).then(
						(t) => {
							cy.task('createGroup', { tournamentId: t.id, ...group })
						},
					)
				}
			})
		})

		after(() => {
			cy.task('deleteSport', { name: sportMock.name })
		})

		it('should be able to edit a group from the list', () => {
			cy.visit('/admin/groups')
			editGroup('QNFLMTY')
			cy.contains('Edit Group').should('be.visible')
		})

		it('should display current group data in the edit form', () => {
			cy.visit('/admin/groups')
			editGroup('QNFLMTY')

			// Check that the form is populated with current data
			cy.get('input[name="name"]').should('have.value', 'QNFLMTY')
			cy.contains('NFL 2025 (American Football)').should('be.visible')
			cy.contains('Tournament cannot be changed after group creation').should(
				'be.visible',
			)
			cy.get('input[name="joinable"]').should('be.checked')
			cy.get('input[name="finished"]').should('not.be.checked')
			cy.get('button').contains('10/18/2025').should('be.visible')
		})

		it('should be able to update group name', () => {
			cy.visit('/admin/groups')
			editGroup('QNFLMTY')

			cy.get('input[name="name"]').clear().type('Peaky Blinders')
			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table').contains('Peaky Blinders').should('be.visible')
			cy.get('table').contains('QNFLMTY').should('not.exist')
		})

		it('should be able to toggle joinable status', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			// Verify current state (should be joinable)
			cy.get('input[name="joinable"]').should('be.checked')
			cy.get('label').contains('Joinable').click()
			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table')
				.contains('Peaky Blinders')
				.parents('tr')
				.within(() => {
					cy.contains('Joinable').should('not.exist')
				})

			// Toggle back to joinable
			editGroup('Peaky Blinders')
			cy.get('input[name="joinable"]').should('not.be.checked')
			cy.get('label').contains('Joinable').click()
			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table')
				.contains('Peaky Blinders')
				.parents('tr')
				.within(() => {
					cy.contains('Joinable').should('be.visible')
				})
		})

		it('should be able to toggle finished status', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			// Verify current state (should not be finished)
			cy.get('input[name="finished"]').should('not.be.checked')
			cy.get('label').contains('Finished').click()
			cy.get('button').contains('Update').click()

			// Should now be on finished groups list
			cy.url().should('include', '/admin/groups')
			cy.get('table').contains('Peaky Blinders').should('not.exist')

			// Check the finished tab
			cy.get('a').contains('Finished').click()
			cy.get('table').contains('Peaky Blinders').should('be.visible')

			// Toggle back to active
			editGroup('Peaky Blinders')
			cy.get('input[name="finished"]').should('be.checked')
			cy.get('label').contains('Finished').click()
			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table').contains('Peaky Blinders').should('be.visible')
		})

		it('should be able to update payment due date', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			// Open date picker and select a new date
			cy.get('button').contains('10/18/2025').click()
			cy.get('[role="dialog"]').should('be.visible')
			cy.get('[role="dialog"]').within(() => {
				cy.get('select').first().select('Dec')
				cy.get('button').contains('25').click()
			})

			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table')
				.contains('Peaky Blinders')
				.parents('tr')
				.within(() => {
					cy.contains('Dec 25, 2025').should('be.visible')
				})
		})

		it.skip('should be able to clear payment due date', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			// Check current date exists
			cy.get('button').contains('10/18/2025').should('be.visible')

			// Clear the hidden input directly to simulate clearing the date
			cy.get('input[name="paymentDueDate"]').invoke('val', '')

			cy.get('button').contains('Update').click()

			cy.url().should('include', '/admin/groups')
			cy.get('table')
				.contains('Peaky Blinders')
				.parents('tr')
				.within(() => {
					cy.get('td').eq(3).should('be.empty') // Payment Due column should be empty
				})
		})

		it('should validate group name is required', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			cy.get('input[name="name"]').clear()
			cy.get('button').contains('Update').click()

			// Should stay on edit page with validation error
			cy.url().should('match', /\/admin\/groups\/\d+\/edit$/)
		})

		it('should prevent duplicate group names within the same tournament', () => {
			// First create a second group in the same tournament
			cy.visit('/admin/groups')
			cy.contains('Add Groups').click()
			cy.get('input[name="name"]').type('Second Group')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2025').click()
			cy.get('button')
				.contains(/create/i)
				.click()

			// Now try to edit the second group to have the same name as the first
			editGroup('Second Group')
			cy.get('input[name="name"]').clear().type('Peaky Blinders')
			cy.get('button').contains('Update').click()

			// Should show error and stay on edit page
			cy.contains(
				'A group with this name already exists for this tournament',
			).should('be.visible')
			cy.url().should('match', /\/admin\/groups\/\d+\/edit$/)
		})

		it('should allow same group name in different tournaments', () => {
			cy.visit('/admin/groups')
			editGroup('Second Group')
			cy.get('input[name="name"]').clear().type('QNFLMTY 2024')
			cy.get('button').contains('Update').click()

			// Should redirect successfully
			cy.url().should('include', '/admin/groups')
			cy.get('table').contains('QNFLMTY 2024').should('be.visible')

			// Create another group with same name but different tournament
			cy.contains('Add Groups').click()
			cy.get('input[name="name"]').type('QNFLMTY 2024')
			cy.get('[name="tournament"]').click()
			cy.contains('[role="option"]', 'NFL 2024').click()
			cy.get('button')
				.contains(/create/i)
				.click()

			// Should succeed
			cy.url().should('include', '/admin/groups')
			cy.get('table').contains('QNFLMTY 2024').should('be.visible')
		})

		it('should be able to cancel editing and return to groups list', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			cy.get('a').contains('Cancel').click()
			cy.url().should('include', '/admin/groups')
			cy.url().should('not.include', '/edit')
		})

		it('should handle 404 for non-existent group', () => {
			cy.visit('/admin/groups/99999/edit', { failOnStatusCode: false })
			cy.contains('This page could not be found').should('be.visible')
		})

		it('should show tournament is read-only in edit mode', () => {
			cy.visit('/admin/groups')
			editGroup('Peaky Blinders')

			// Tournament field should be read-only (not a select)
			cy.get('select[name="tournament"]').should('not.exist')
			cy.contains('NFL 2025 (American Football)').should('be.visible')
			cy.contains('Tournament cannot be changed after group creation').should(
				'be.visible',
			)
		})
	})
})
