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
 *  - [x] can view all user name, email, createdAt, accounts count, phone
 *  - [x] can suspend the user
 *  - [x] can activate the user
 *  - [x] can make the user admin
 *  - [x] can remove the user from admin
 *  - [ ] can view a user's accounts
 *   - [ ] username
 *   - [ ] can edit a user account
 *    - [ ] can change the username
 *  - [ ] can view a user's memberships
 *    - [ ] group, createdAt, paid, total points, position, notes, forgot picks, status (active/completed)
 *    - [ ] display muted colors when status is completed
 *    - [ ] sort and show all active memberships first
 *    - [ ] can navigate to the group details screen pressing the group name
 *    - [ ] can filter memberships by various criteria
 *    - [ ] can sort memberships by various criteria
 *    - [ ] can select multiple memberships and perform bulk actions
 *      - [ ] set paid, notes
 *
 * Can edit user's basic information
 *  - [ ] can edit name, email, phone
 */

const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6)

const testAdmin = {
	name: 'John Wick',
	email: 'john@wick.com',
	phone: '555-555-5555',
	createdAt: sixMonthsAgo.toISOString(),
	accounts: [
		{
			username: 'john-wick',
			avatar: 'lightning',
		},
		{
			username: 'amanda-fire',
			avatar: 'heart',
		},
		{
			username: 'daniel-wick',
			avatar: 'star',
		},
	],
}

const activeUsers = [
	{
		name: 'Sarah Johnson',
		email: 'sarah.johnson@gmail.com',
		phone: '555-123-4567',
		createdAt: '2024-03-15T10:30:00.000Z', // March 15, 2024
		accounts: [
			{ username: 'sarah_j', avatar: 'heart' },
			{ username: 'sarahj2024', avatar: 'star' },
			{ username: 'sjohnson', avatar: 'lightning' },
		],
	},
	{
		name: 'Michael Chen',
		email: 'mchen@yahoo.com',
		phone: '555-234-5678',
		createdAt: '2024-01-22T14:45:00.000Z', // January 22, 2024
		accounts: [
			{ username: 'mchen', avatar: 'fire' },
			{ username: 'mikechen88', avatar: 'diamond' },
			{ username: 'chenmike', avatar: 'crown' },
		],
	},
	{
		name: 'Emily Rodriguez',
		email: 'emily.rodriguez@outlook.com',
		phone: '555-345-6789',
		createdAt: '2024-07-08T09:15:00.000Z', // July 8, 2024
		accounts: [
			{ username: 'emily_r', avatar: 'moon' },
			{ username: 'erodriguez', avatar: 'sun' },
			{ username: 'emilyr23', avatar: 'snowflake' },
		],
	},
	{
		name: 'David Thompson',
		email: 'dthompson@hotmail.com',
		phone: '555-456-7890',
		createdAt: '2024-05-12T16:20:00.000Z', // May 12, 2024
		accounts: [
			{ username: 'dthompson', avatar: 'shield' },
			{ username: 'davidt', avatar: 'spade' },
			{ username: 'thompson_d', avatar: 'club' },
		],
	},
	{
		name: 'Jessica Martinez',
		email: 'jessica.martinez@gmail.com',
		phone: '555-567-8901',
		createdAt: '2024-02-28T11:00:00.000Z', // February 28, 2024
		accounts: [
			{ username: 'jess_martinez', avatar: 'crown' },
			{ username: 'jmartinez', avatar: 'diamond' },
			{ username: 'jessica_m', avatar: 'gamepad' },
		],
	},
	{
		name: 'Robert Wilson',
		email: 'rwilson@icloud.com',
		phone: '555-678-9012',
		createdAt: '2024-06-03T13:30:00.000Z', // June 3, 2024
		accounts: [
			{ username: 'rwilson', avatar: 'user' },
			{ username: 'robwilson', avatar: 'rocket' },
			{ username: 'bob_wilson', avatar: 'lightning' },
		],
	},
	{
		name: 'Amanda Foster',
		email: 'amanda.foster@gmail.com',
		phone: '555-789-0123',
		createdAt: '2024-04-18T08:45:00.000Z', // April 18, 2024
		accounts: [
			{ username: 'amanda_f', avatar: 'fire' },
			{ username: 'afoster', avatar: 'heart' },
			{ username: 'mandyfoster', avatar: 'star' },
		],
	},
	{
		name: 'Christopher Lee',
		email: 'chris.lee@yahoo.com',
		phone: '555-890-1234',
		createdAt: '2024-08-25T15:10:00.000Z', // August 25, 2024
		accounts: [
			{ username: 'chris_lee', avatar: 'rocket' },
			{ username: 'clee2024', avatar: 'moon' },
			{ username: 'christopher_l', avatar: 'sun' },
		],
	},
	{
		name: 'Nicole Davis',
		email: 'nicole.davis@outlook.com',
		phone: '555-901-2345',
		createdAt: '2024-09-01T12:25:00.000Z', // September 1, 2024
		accounts: [
			{ username: 'nicole_d', avatar: 'diamond' },
			{ username: 'ndavis', avatar: 'crown' },
			{ username: 'nickdavis', avatar: 'shield' },
		],
	},
	{
		name: 'Kevin Anderson',
		email: 'kevin.anderson@gmail.com',
		phone: '555-012-3456',
		createdAt: '2024-11-14T17:55:00.000Z', // November 14, 2024
		accounts: [
			{ username: 'kevin_a', avatar: 'gamepad' },
			{ username: 'kanderson', avatar: 'spade' },
			{ username: 'kevinanderson', avatar: 'club' },
		],
	},
]

const suspendedUsers = [
	{
		name: 'Alice Smith',
		suspended: true,
		email: 'alice.smith@example.com',
		phone: '555-111-2222',
		createdAt: '2024-02-15T09:00:00.000Z', // February 15, 2024
		accounts: [
			{ username: 'alice_s', avatar: 'heart' },
			{ username: 'asmith', avatar: 'star' },
			{ username: 'alice_smith', avatar: 'crown' },
		],
	},
	{
		name: 'Bob Johnson',
		suspended: true,
		email: 'bob.johnson@example.com',
		phone: '555-222-3333',
		createdAt: '2024-03-10T14:30:00.000Z', // March 10, 2024
		accounts: [
			{ username: 'bob_j', avatar: 'sun' },
			{ username: 'bjohnson', avatar: 'moon' },
			{ username: 'bob_johnson', avatar: 'lightning' },
		],
	},
	{
		name: 'Charlie Brown',
		suspended: true,
		email: 'charlie.brown@example.com',
		phone: '555-333-4444',
		createdAt: '2024-04-05T11:15:00.000Z', // April 5, 2024
		accounts: [
			{ username: 'charlie_b', avatar: 'fire' },
			{ username: 'cbrown', avatar: 'snowflake' },
			{ username: 'charlie_brown', avatar: 'user' },
		],
	},
]

describe('An Admin', () => {
	before(() => {
		const { accounts, ...admin } = testAdmin
		cy.task('createAdmin', admin).then(({ id }) => {
			for (const account of accounts) {
				cy.task('createUserAccount', {
					userId: id,
					...account,
				})
			}
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
		before(() => {
			for (const { accounts, ...user } of activeUsers) {
				cy.task('createUser', user).then(({ id }) => {
					for (const account of accounts) {
						cy.task('createUserAccount', {
							userId: id,
							...account,
						})
					}
				})
			}

			for (const { accounts, ...user } of suspendedUsers) {
				cy.task('createUser', user).then(({ id }) => {
					for (const account of accounts) {
						cy.task('createUserAccount', {
							userId: id,
							...account,
						})
					}
				})
			}
		})

		after(() => {
			for (const user of activeUsers) {
				cy.task('deleteUser', user.email)
			}
			for (const user of suspendedUsers) {
				cy.task('deleteUser', user.email)
			}
		})

		it('should display the user details', () => {
			cy.visit('/admin/users')
			cy.contains(/name/i)
			cy.contains(/email/i)
			cy.contains(/phone/i)
			cy.contains(/created at/i)
			cy.get('input[placeholder="Filter Users..."]').type(testAdmin.name)
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
			cy.get(`div[title="${testAdmin.accounts[0]?.username}"]`).trigger(
				'mouseover',
			)
			cy.get('div[role="tooltip"]').should(
				'contain',
				testAdmin.accounts[0]?.username,
			)
			cy.get(`div[title="${testAdmin.accounts[1]?.username}"]`).trigger(
				'mouseover',
			)
			cy.get('div[role="tooltip"]').should(
				'contain',
				testAdmin.accounts[1]?.username,
			)
			cy.get(`div[title="${testAdmin.accounts[2]?.username}"]`).trigger(
				'mouseover',
			)
			cy.get('div[role="tooltip"]').should(
				'contain',
				testAdmin.accounts[2]?.username,
			)
		})

		it('should display the total number of active users', () => {
			cy.visit('/admin/users')
			cy.contains('Page 1 of 2')
			cy.contains('0 of 11 row(s) selected.')
			cy.get('button[title="Go to previous page"]').should('be.disabled')
			cy.get('button[title="Go to next page"]').click()
			cy.contains('Page 2 of 2')
			cy.get('button[title="Go to previous page"]').click()
			cy.contains('Page 1 of 2')
		})

		it('by default show non-suspended users only', () => {
			cy.visit('/admin/users')
			cy.get('input[placeholder="Filter Users..."]').type('Alice')
			cy.contains('Alice Smith').should('not.exist')
			cy.get('input[placeholder="Filter Users..."]').clear().type('Bob')
			cy.contains('Bob Johnson').should('not.exist')
			cy.get('input[placeholder="Filter Users..."]').clear().type('Charlie')
			cy.contains('Charlie Brown').should('not.exist')
		})

		it('should be able to show suspended users', () => {
			cy.visit('/admin/users')
			cy.get('a').contains('Suspended').click()
			cy.contains('Alice Smith').should('exist')
			cy.contains('Bob Johnson').should('exist')
			cy.contains('Charlie Brown').should('exist')
		})

		it('should be able to show all users', () => {
			cy.visit('/admin/users')
			cy.get('a').contains('All').click()
			cy.get('input[placeholder="Filter Users..."]').type('Alice')
			cy.contains('Alice Smith').should('exist')
			cy.get('input[placeholder="Filter Users..."]')
				.clear()
				.type('David Thompson')
			cy.contains('David Thompson').should('exist')
		})

		it('should be able to bulk suspend users', () => {
			cy.visit('/admin/users')
			cy.get('input[placeholder="Filter Users..."]').type('Sarah Johnson')
			cy.contains('Sarah Johnson')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('input[placeholder="Filter Users..."]')
				.clear()
				.type('Michael Chen')
			cy.contains('Michael Chen')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('input[placeholder="Filter Users..."]')
				.clear()
				.type('Emily Rodriguez')
			cy.contains('Emily Rodriguez')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('button[title="Bulk Suspend"]').click()
			cy.contains('Are you sure you want to suspend these 3 users?').should(
				'exist',
			)
			cy.get('button').contains('Suspend').click()
			cy.get('input[placeholder="Filter Users..."]')
				.clear()
				.type('Sarah Johnson')
			cy.contains('Sarah Johnson').should('not.exist')
			cy.get('a')
				.contains(/suspended/i)
				.click()
			cy.contains('Sarah Johnson').should('exist')
		})

		it('should be able to bulk activate users', () => {
			cy.visit('/admin/users')
			cy.get('a')
				.contains(/suspended/i)
				.click()
			cy.get('input[placeholder="Filter Users..."]')
				.clear()
				.type('Charlie Brown')
			cy.contains('Charlie Brown')
				.parents('tr')
				.find('[role="checkbox"]')
				.click()
			cy.get('input[placeholder="Filter Users..."]').clear()
			cy.get('button[title="Bulk Activate"]').click()
			cy.contains('Are you sure you want to activate these 1 users?').should(
				'exist',
			)
			cy.get('button').contains('Activate').click()
			cy.get('input[placeholder="Filter Users..."]').type('Charlie Brown')
			cy.contains('Charlie Brown').should('not.exist')
			cy.get('input[placeholder="Filter Users..."]').clear()
			cy.get('a')
				.contains(/active/i)
				.click()
			cy.get('input[placeholder="Filter Users..."]').type('Charlie Brown')
			cy.contains('Charlie Brown').should('exist')
		})
	})

	describe('Viewing User Overview', () => {
		let userId: number | undefined = undefined
		before(() => {
			cy.task('createUser', {
				name: 'Gabriel Garcia',
				email: 'gabriel.garcia@gmail.com',
				phone: '555-123-4567',
				createdAt: '2023-04-20T12:34:56Z',
			}).then(({ id }) => {
				userId = id
				cy.task('createUserAccount', {
					userId: id,
					username: 'gabriel.garcia',
					avatar: 'heart',
				})
			})
		})

		after(() => {
			cy.task('deleteUser', 'gabriel.garcia@gmail.com')
			userId = undefined
		})

		it('should be able to view a user details', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.url().should('include', `/admin/users/${userId}`)
			cy.contains('Gabriel Garcia').should('exist')
			cy.contains('gabriel.garcia@gmail.com').should('exist')
			cy.contains('555-123-4567').should('exist')
			cy.contains('joined 20/04/2023').should('exist')
		})
		it('should be able to suspend a user', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.get('button[title="Settings"]').should('be.visible').click()
			cy.contains('Suspend User').should('be.visible').click()
			cy.contains('Are you sure you want to suspend this user?').should(
				'be.visible',
			)
			cy.get('button[title="Confirm Suspend"]').click()
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.contains('Suspended').should('be.visible')
			cy.get('a').contains(/users/i).click()
			cy.url().should('include', '/admin/users')
			cy.get('a')
				.contains(/suspended/i)
				.click()
			cy.get('input[placeholder="Filter Users..."]').type('Gabriel Garcia')
			cy.contains('Gabriel Garcia').should('be.visible')
		})
		it('should be able to activate a user', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.get('button[title="Settings"]').should('be.visible').click()
			cy.contains('Activate User').should('be.visible').click()
			cy.contains('Are you sure you want to activate this user?').should(
				'be.visible',
			)
			cy.get('button[title="Confirm Activate"]').click()
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.contains('Suspended').should('not.exist')
			cy.get('a').contains(/users/i).click()
			cy.url().should('include', '/admin/users')
			cy.get('a')
				.contains(/active/i)
				.click()
			cy.get('input[placeholder="Filter Users..."]').type('Gabriel Garcia')
			cy.contains('Gabriel Garcia').should('be.visible')
		})
		it('should be able to make a user admin', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.get('main').contains('Admin').should('not.exist')
			cy.get('button[title="Settings"]').should('be.visible').click()
			cy.contains('Make Admin').should('be.visible').click()
			cy.contains('Are you sure you want to make this user an admin?').should(
				'be.visible',
			)
			cy.get('button[title="Confirm Make Admin"]').click()
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.contains('Admin').should('be.visible')
		})
		it('should be able to remove a user admin', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.get('main').contains('Admin').should('exist')
			cy.get('button[title="Settings"]').should('be.visible').click()
			cy.contains('Remove Admin').should('be.visible').click()
			cy.contains(
				'Are you sure you want to remove this user as an admin?',
			).should('be.visible')
			cy.get('button[title="Confirm Remove Admin"]').click()
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.get('main').contains('Admin').should('not.exist')
		})
	})

	describe('Viewing User Accounts', () => {
		let userId: number | undefined = undefined
		before(() => {
			cy.task('createUser', {
				name: 'Sarah Johnson',
				email: 'sarah.johnson@gmail.com',
				phone: '555-987-6543',
				createdAt: '2023-06-15T10:20:30Z',
			}).then(({ id }) => {
				userId = id
				cy.task('createUserAccount', {
					userId: id,
					username: 'sarah.johnson',
					avatar: 'heart',
				})
				cy.task('createUserAccount', {
					userId: id,
					username: 'dark.sarah',
					avatar: 'star',
				})
				cy.task('createUserAccount', {
					userId: id,
					username: 'julio-jones',
					avatar: 'lightning',
				})
			})
		})

		after(() => {
			cy.task('deleteUser', 'sarah.johnson@gmail.com')
			userId = undefined
		})

		it('should be able to view a user accounts', () => {
			cy.visit(`/admin/users/${userId}`)
			cy.get('div[title="User Accounts Count"]')
				.contains('3')
				.should('be.visible')
			cy.get('button').contains('Accounts').should('be.visible').click()
			cy.contains('sarah.johnson').should('be.visible')
			cy.contains('dark.sarah').should('be.visible')
			cy.contains('julio-jones').should('be.visible')
		})
	})

	describe('Editing Users', () => {
		let userId: number | undefined = undefined
		before(() => {
			cy.task('createUser', {
				name: 'Gabriel Garcia',
				email: 'gabriel.garcia@gmail.com',
				phone: '555-123-4567',
				createdAt: '2023-04-20T12:34:56Z',
			}).then(({ id }) => {
				userId = id
				cy.task('createUserAccount', {
					userId: id,
					username: 'gabriel.garcia',
					avatar: 'heart',
				})
			})
		})

		after(() => {
			cy.task('deleteUser', 'gabriel.newemail@gmail.com')
			userId = undefined
		})

		it('should navigate to the edit user page', () => {
			cy.visit('/admin/users')
			cy.get('input[placeholder="Filter Users..."]').type('Gabriel Garcia')
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.get('tr').last().find('button[title="More Actions"]').click()
			cy.contains('Edit User').click()
			cy.url().should('include', `/admin/users/${userId}/edit`)
			cy.contains('Edit User').should('be.visible')
			cy.get('input[name="email"]').should(
				'have.value',
				'gabriel.garcia@gmail.com',
			)
			cy.get('input[name="name"]').should('have.value', 'Gabriel Garcia')
			cy.get('input[name="phone"]').should('have.value', '555-123-4567')
			cy.visit(`/admin/users/${userId}`)
			cy.contains('Gabriel Garcia').should('be.visible')
			cy.contains('Edit User').click()
			cy.url().should('include', `/admin/users/${userId}/edit`)
			cy.get('input[name="email"]').should(
				'have.value',
				'gabriel.garcia@gmail.com',
			)
		})
		it('should be able to edit a user basic information', () => {
			cy.visit(`/admin/users/${userId}/edit`)
			cy.get('input[name="email"]').clear().type('gabriel.newemail@gmail.com')
			cy.get('input[name="name"]').clear().type('Gabriel Newname Real Long')
			cy.get('input[name="phone"]').clear().type('555-987-6543')
			cy.get('button[type="submit"]').click()
			cy.url().should('include', `/admin/users/${userId}`)
			cy.contains('Gabriel Newname').should('be.visible')
			cy.contains('gabriel.newemail@gmail.com').should('be.visible')
			cy.contains('555-987-6543').should('be.visible')
		})
		it('should show validation errors when editing a user with invalid data', () => {
			cy.visit(`/admin/users/${userId}/edit`)
			cy.get('input[name="email"]').clear().type('not-an-email')
			cy.get('button[type="submit"]').click()
			cy.url().should('include', `/admin/users/${userId}/edit`)
			cy.visit(`/admin/users/${userId}/edit`)
			cy.get('input[name="phone"]').clear().type('123-123-123-123-123-123')
			cy.get('button[type="submit"]').click()
			cy.contains('Phone number must be at most 15 characters long').should(
				'be.visible',
			)
		})
	})
})
