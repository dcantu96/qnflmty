const testUser = {
	name: 'Journey Test User',
	email: 'journey-test@example.com',
}
const firstUsername = 'JourneyTester'
const secondUsername = 'SecondProfile'

const sport = {
	name: 'Football',
}

const tournament = {
	name: 'Champions League',
	year: 2024,
}

const group = {
	name: 'Thunder',
	joinable: true,
}

describe('A New Authenticated User without access to dashboard', () => {
	before(() => {
		cy.task('createUser', testUser)
	})

	after(() => {
		cy.task('deleteUser', testUser.email)
	})

	beforeEach(() => {
		cy.clearCookies()
		cy.login(testUser.email)
	})

	describe('Creating a profile', () => {
		it('Should be redirected to /create-profile', () => {
			cy.visit('/')
			cy.url().should('include', '/create-profile')
			cy.contains(/Create Your Profile/i)
			cy.contains(/Choose a username and avatar to get started with Qnflmty/i)
		})
		it('Should see all avatar options', () => {
			cy.visit('/create-profile')
			cy.contains(/Choose your avatar/i).should('be.visible')
			cy.get('label').contains(/User/i).should('be.visible')
			cy.get('label').contains(/Crown/i).should('be.visible')
			cy.get('label').contains(/Star/i).should('be.visible')
			cy.get('label').contains(/Heart/i).should('be.visible')
			cy.get('label')
				.contains(/Shield/i)
				.should('be.visible')
			cy.get('label')
				.contains(/Rocket/i)
				.should('be.visible')
			cy.get('label')
				.contains(/Gamepad/i)
				.should('be.visible')
			cy.get('label')
				.contains(/Diamond/i)
				.should('be.visible')
			cy.get('label').contains(/Club/i).should('be.visible')
			cy.get('label').contains(/Spade/i).should('be.visible')
			cy.get('label')
				.contains(/Lightning/i)
				.should('be.visible')
			cy.get('label').contains(/Fire/i).should('be.visible')
			cy.get('label')
				.contains(/Snowflake/i)
				.should('be.visible')
			cy.get('label').contains(/Sun/i).should('be.visible')
			cy.get('label').contains(/Moon/i).should('be.visible')
		})
		it('Should see errors if username is invalid', () => {
			cy.visit('/create-profile')

			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.should('have.css', 'pointer-events', 'none')
				.should('have.css', 'opacity', '0.5')

			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.type('invalid@user!')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()
			cy.contains(
				/Username can only contain letters, numbers, underscores, and hyphens/i,
			)

			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.invoke('val', 'a'.repeat(25)) // Bypass maxLength attribute
				.trigger('input') // Trigger input event
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()
			cy.contains(/Username must be 20 characters or less/i)
		})

		it('Should trim whitespace from username', () => {
			cy.visit('/create-profile')

			cy.get('input[name="username"]').clear().type(' testuser')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			cy.url().should('include', '/request-access')
			cy.contains(/Profile Created/i)
				.parent()
				.find('h2')
				.should('contain.text', 'testuser')

			cy.visit('/create-profile')

			cy.get('input[name="username"]').clear().type('anothertest ')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			cy.url().should('include', '/request-access')
			cy.contains(/Profile Created/i)
				.parent()
				.find('h2')
				.should('contain.text', 'anothertest')
		})

		it('Username should be unique case insensitive', () => {
			cy.visit('/create-profile')

			cy.get('input[name="username"]').clear().type('UniqueUser')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			cy.url().should('include', '/request-access')
			cy.contains(/Profile Created/i)
				.parent()
				.find('h2')
				.should('contain.text', 'UniqueUser')

			// Attempt to create another profile with same username but different case
			cy.visit('/create-profile')
			cy.get('input[name="username"]').clear().type('uniqueuser')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			// Should see error about username already taken
			cy.contains(/Username is already taken/i)
		})

		it('Should not allow spaces in username', () => {
			cy.visit('/create-profile')
			// Test space in the middle
			cy.get('input[name="username"]').clear().type('test user')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()
			cy.contains(
				/Username can only contain letters, numbers, underscores, and hyphens/i,
			)

			// Test multiple spaces
			cy.get('input[name="username"]').clear().type('test  user  name')
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()
			cy.contains(
				/Username can only contain letters, numbers, underscores, and hyphens/i,
			)
		})

		it('Should be able to successfully create a profile', () => {
			cy.visit('/create-profile')

			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.type(firstUsername)

			cy.get('label')
				.contains(/Rocket/i)
				.click()

			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			cy.url().should('include', '/request-access')
			cy.contains(/Profile Created/i)
				.parent()
				.find('h2')
				.should('contain.text', firstUsername)
		})
		describe('Without a joinable group', () => {
			it('Should see message about no joinable groups', () => {
				cy.visit('/')
				cy.contains(firstUsername).click()
				cy.url().should('include', '/request-access')
				cy.contains(
					/There are currently no active groups available for requests. Please check back later./i,
				)
			})
		})
		describe('With a joinable group', () => {
			before(() => {
				cy.task('createSport', sport).then((s) => {
					cy.task('createTournament', { ...tournament, sportId: s.id }).then(
						(t) => {
							cy.task('createGroup', { ...group, tournamentId: t.id })
						},
					)
				})
			})

			after(() => {
				cy.task('deleteGroup', { name: group.name })
				cy.task('deleteTournament', { name: tournament.name })
				cy.task('deleteSport', { name: sport.name })
			})

			it('Should be able to request access', () => {
				// This is verified in the previous test, but we can add specific checks
				cy.visit('/')
				cy.contains(firstUsername).click()
				cy.url().should('include', '/request-access')
				cy.get('button')
					.contains(/Request Access/i)
					.click()
				cy.contains(/Request Already Submitted/i)
			})
		})
	})

	describe('From the profile selector', () => {
		it('Can select a profile', () => {
			cy.visit('/select-profile')
			cy.contains(/Select your profile to continue/i).should('be.visible')
			cy.contains(firstUsername).should('be.visible')
			cy.get('h3').contains(firstUsername).click()
			cy.url().should('include', '/request-access')
		})
	})

	describe('Can edit a profile', () => {
		it('Should update avatar from profile selection screen', () => {
			cy.visit('/select-profile')

			// Find the profile card and hover to reveal edit button
			cy.get('div').contains(firstUsername).closest('div').as('profileCard')

			cy.get('@profileCard')
				.trigger('mouseover')
				.within(() => {
					cy.get('button')
						.contains(/Edit avatar/i)
						.click({ force: true })
				})

			// Avatar update modal should open
			cy.contains(/Update Avatar/i).should('be.visible')
			cy.contains(`Choose a new avatar for ${firstUsername}`).should(
				'be.visible',
			)

			// Select a different avatar (Star)
			cy.get('button').contains(/Star/i).click()

			// Save changes
			cy.get('button')
				.contains(/Update Avatar/i)
				.click()

			// Modal should close
			cy.contains(/Update Avatar/i).should('not.exist')
		})
	})

	describe('Can create additional profiles', () => {
		it('Should see errors if the username is already taken', () => {
			cy.visit('/select-profile')

			// Click "Add Profile" button
			cy.get('h3')
				.contains(/Add Profile/i)
				.click()

			// Should be redirected to create-profile
			cy.url().should('include', '/create-profile')
			cy.contains(/Create New Profile/i)
			cy.contains(/Add another profile to your account/i)

			// Try to use the same username as the first profile
			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.type(firstUsername)

			cy.get('label').contains(/Crown/i).click()

			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			// Should see error about username already taken
			cy.contains(/Username is already taken/i)
		})

		it('Should successfully create a second profile with unique username', () => {
			cy.visit('/select-profile')

			// Click "Add Profile" button
			cy.get('h3')
				.contains(/Add Profile/i)
				.click()

			// Create second profile with unique username
			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.type(secondUsername)

			// Select different avatar
			cy.get('label').contains(/Crown/i).click()

			// Submit the form
			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			// Should be redirected to request access page
			cy.url().should('include', '/request-access')

			// Verify the newly created profile username appears
			cy.contains(/Profile Created/i)
				.parent()
				.find('h2')
				.should('contain.text', secondUsername)

			cy.contains(secondUsername)
		})

		it('Should show multiple profiles in selection screen', () => {
			cy.visit('/select-profile')

			// Should see both profiles
			cy.contains(firstUsername).should('be.visible')
			cy.contains(secondUsername).should('be.visible')

			// Should still see "Add Profile" option
			cy.contains(/Add Profile/i).should('be.visible')
		})
	})

	describe('Can switch between profiles', () => {
		it('From the requests page', () => {
			// First select a profile
			cy.visit('/select-profile')
			cy.contains(firstUsername).click()

			// Should be on request access page for first profile
			cy.url().should('include', '/request-access')
			cy.get('a')
				.contains(/Switch Profile/i)
				.click()

			cy.contains(firstUsername).should('be.visible')
			cy.contains(secondUsername).should('be.visible')

			cy.contains(/Add profile/i).should('be.visible')

			cy.contains(secondUsername).click()

			cy.url().should('include', '/request-access')
			cy.contains(secondUsername)
		})
	})
})
