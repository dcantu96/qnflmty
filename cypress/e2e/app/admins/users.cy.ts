/**
 * An admin
 * Can view all users
 *  - [x] details: name, email, phone, userAccounts, createdAt
 *  - [x] client pagination works, shows correct page numbers
 *  - [x] show only non-suspended users by default and allow filtering by suspended, active or all
 *  - [x] can search users by various criteria
 *  - [x] can sort users by various criteria
 *  - [x] can select multiple users and perform bulk actions:
 *    - [x] suspend users
 *    - [x] activate users
 * Can view a user
 *  - [ ] can view all user details
 *  - [ ] can view a chip list of the user's accounts
 *   - [ ] username
 *   - [ ] can edit a user account
 *    - [ ] can change the username
 *  - [ ] can suspend the user
 *  - [ ] can view a table list of memberships
 *    - [ ] group, createdAt, paid, total points, position, notes, forgot picks, status (active/completed)
 *    - [ ] display muted colors when status is completed
 *    - [ ] sort and show all active memberships first
 *    - [ ] can navigate to the group details screen pressing the group name
 *    - [ ] can filter memberships by various criteria
 *    - [ ] can sort memberships by various criteria
 *    - [ ] can select multiple memberships and perform bulk actions
 *      - [ ] set paid, notes
 *
 * Can edit users
 *  - [ ] can edit name, email, phone, suspended
 *  - [ ] can select multiple users and perform bulk actions
 */

import { avatarEnum } from '~/server/db/schema'

const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6)

const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
	phone: '555-555-5555',
	createdAt: sixMonthsAgo.toISOString(),
}

const userAccount = {
	username: 'john-wick',
	avatar: 'lightning',
}

const userAccount2 = {
	username: 'amanda-fire',
	avatar: 'heart',
}

const userAccount3 = {
	username: 'daniel-wick',
	avatar: 'star',
}

describe('An Admin', () => {
	before(() => {
		cy.task('createAdmin', testAdmin).then(({ id }) => {
			cy.task('createUserAccount', { ...userAccount, userId: id })
			cy.task('createUserAccount', { ...userAccount2, userId: id })
			cy.task('createUserAccount', { ...userAccount3, userId: id })
		})
	})

	after(() => {
		cy.task('deleteUser', testAdmin.email)
	})

	beforeEach(() => {
		cy.clearCookies()
		cy.login(testAdmin.email)
	})

	it('should be able to navigate to users list', () => {
		cy.visit('/admin')
		cy.contains(/users/i).click()
		cy.url().should('include', '/admin/users')
	})

	describe('Viewing Users', () => {
		describe('With the admin user', () => {
			it('should display the user details', () => {
				cy.visit('/admin/users')
				cy.contains(/name/i)
				cy.contains(/email/i)
				cy.contains(/phone/i)
				cy.contains(/created at/i)
				cy.contains(testAdmin.name)
				cy.contains(testAdmin.email)
				cy.contains(testAdmin.phone)
				cy.contains(
					sixMonthsAgo.toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					}),
				)
				cy.contains(/accounts/i)
				cy.get(`div[title="${userAccount.username}"]`).trigger('mouseover')
				cy.get('div[role="tooltip"]').should('contain', userAccount.username)
				cy.get(`div[title="${userAccount2.username}"]`).trigger('mouseover')
				cy.get('div[role="tooltip"]').should('contain', userAccount2.username)
				cy.get(`div[title="${userAccount3.username}"]`).trigger('mouseover')
				cy.get('div[role="tooltip"]').should('contain', userAccount3.username)
			})
		})
		describe('With 26 users', () => {
			before(() => {
				for (let i = 1; i <= 20; i++) {
					cy.task('createUser', {
						name: `User ${i}`,
						email: `user${i}@example.com`,
						phone: `555-555-${i}`,
						createdAt: new Date(
							Date.now() -
								Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30 * 5),
						).toISOString(),
					}).then(({ id }) => {
						cy.task('createUserAccount', {
							userId: id,
							username: `user${i}`,
							avatar: avatarEnum.enumValues.at(
								Math.floor(Math.random() * 14) + 1,
							),
						})
					})
				}
				for (let i = 1; i <= 5; i++) {
					cy.task('createUser', {
						name: `Suspended User ${i}`,
						email: `suspended.user${i}@example.com`,
						phone: `555-555-${i}`,
						createdAt: new Date(
							Date.now() -
								Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30 * 5),
						).toISOString(),
						suspended: true,
					}).then(({ id }) => {
						cy.task('createUserAccount', {
							userId: id,
							username: `suspended.user${i}`,
							avatar: avatarEnum.enumValues.at(
								Math.floor(Math.random() * 14) + 1,
							),
						})
					})
				}
			})

			after(() => {
				cy.task('deleteUser', testAdmin.email)
				for (let i = 1; i <= 20; i++) {
					cy.task('deleteUser', `user${i}@example.com`)
				}
				for (let i = 1; i <= 5; i++) {
					cy.task('deleteUser', `suspended.user${i}@example.com`)
				}
			})

			it('should display the total number of active users', () => {
				cy.visit('/admin/users')
				cy.contains('Page 1 of 3')
				cy.contains('0 of 21 row(s) selected.')
				cy.get('button[title="Go to previous page"]').should('be.disabled')
				cy.get('button[title="Go to next page"]').click()
				cy.contains('Page 2 of 3')
				cy.get('button[title="Go to previous page"]').click()
				cy.contains('Page 1 of 3')
			})

			it('by default show non-suspended users only', () => {
				cy.visit('/admin/users')
				cy.get('input[placeholder="Filter Users..."]').type('Suspended')
				cy.contains('Suspended User 1').should('not.exist')
				cy.contains('Suspended User 2').should('not.exist')
				cy.contains('Suspended User 3').should('not.exist')
				cy.contains('Suspended User 4').should('not.exist')
				cy.contains('Suspended User 5').should('not.exist')
			})

			it('should be able to show suspended users', () => {
				cy.visit('/admin/users')
				cy.get('a').contains('Suspended').click()
				cy.contains('Suspended User 1').should('exist')
				cy.contains('Suspended User 2').should('exist')
				cy.contains('Suspended User 3').should('exist')
				cy.contains('Suspended User 4').should('exist')
				cy.contains('Suspended User 5').should('exist')
			})

			it('should be able to show all users', () => {
				cy.visit('/admin/users')
				cy.get('a').contains('All').click()
				cy.get('input[placeholder="Filter Users..."]').type('Suspended')
				cy.contains('Suspended User 1').should('exist')
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 19')
				cy.contains('User 19').should('exist')
				cy.get('input[placeholder="Filter Users..."]')
					.clear()
					.type('user19@example')
				cy.contains('User 19').should('exist')
			})

			it('should be able to bulk suspend users', () => {
				cy.visit('/admin/users')
				cy.get('input[placeholder="Filter Users..."]').type('User 1')
				cy.contains('User 1').parents('tr').find('[role="checkbox"]').click()
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 2')
				cy.contains('User 2').parents('tr').find('[role="checkbox"]').click()
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 3')
				cy.contains('User 3').parents('tr').find('[role="checkbox"]').click()
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 4')
				cy.contains('User 4').parents('tr').find('[role="checkbox"]').click()
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 5')
				cy.contains('User 5').parents('tr').find('[role="checkbox"]').click()
				cy.get('button[title="Bulk Suspend"]').click()
				cy.contains('Are you sure you want to suspend these 5 users?').should(
					'exist',
				)
				cy.get('button').contains('Suspend').click()
				cy.get('input[placeholder="Filter Users..."]').clear().type('User 5')
				cy.contains('User 5').should('not.exist')
				cy.get('a')
					.contains(/suspended/i)
					.click()
				cy.contains('User 5').should('exist')
				cy.get('input[placeholder="Filter Users..."]')
					.clear()
					.type('Suspended User 5')
				cy.contains('Suspended User 5')
					.parents('tr')
					.find('[role="checkbox"]')
					.click()
				cy.get('button[title="Bulk Activate"]').click()
				cy.contains('Are you sure you want to activate these 1 users?').should(
					'exist',
				)
				cy.get('button').contains('Activate').click()
				cy.get('input[placeholder="Filter Users..."]')
					.clear()
					.type('Suspended User 5')
				cy.contains('Suspended User 5').should('not.exist')
				cy.get('a')
					.contains(/active/i)
					.click()
				cy.get('input[placeholder="Filter Users..."]')
					.clear()
					.type('Suspended User 5')
				cy.contains('Suspended User 5').should('exist')
			})
		})
	})
})
