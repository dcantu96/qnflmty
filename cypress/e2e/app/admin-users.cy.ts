/**
 * An admin
 * Can view all users
 *  - [ ] name, email, phone, userAccounts, suspended, createdAt
 *  - [ ] can filter users by various criteria
 *  - [ ] can sort users by various criteria
 *  - [ ] can select multiple users and perform bulk actions:
 *    - [ ] suspend users
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

const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
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

	it('should be able to navigate to users list', () => {
		cy.visit('/admin')
		cy.contains(/users/i).click()
		cy.url().should('include', '/admin/users')
	})

	describe('Viewing Users', () => {
		describe('With no users', () => {
			it('should display no results if no users exist', () => {
				cy.visit('/admin/users')
				cy.contains(/name/i)
				cy.contains(/email/i)
				cy.contains(/phone/i)
				cy.contains(/accounts/i)
				cy.contains(/suspended/i)
				cy.contains(/created at/i)
				cy.contains(/no users found/i)
			})
		})
	})
})
