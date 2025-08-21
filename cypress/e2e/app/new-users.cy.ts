// A New Authenticated User without access to dashboard
// - Creating a profile
//  - should be redirected to /create-profile
//  - should see all avatar options
//  - should see errors if the username is invalid
//  - should be able to successfully create a profile
//  - should be redirected to request access page
// - can select a profile from the profile selector
//  - should see the request access page
// - can edit a profile
// - can create additional profiles
//  - should see errors if the username is already taken
// - can switch between profiles
const testUser = {
	name: 'Journey Test User',
	email: 'journey-test@example.com',
}
const firstUsername = 'JourneyTester'
const secondUsername = 'SecondProfile'
describe('A New Authenticated User without access to dashboard', () => {
	before(() => {
		cy.createUser(testUser)
	})

	after(() => {
		cy.deleteUser(testUser.email)
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

		it('Should be redirected to request access page', () => {
			// This is verified in the previous test, but we can add specific checks
			cy.visit('/create-profile')

			cy.get('label')
				.contains(/Username/i)
				.parent()
				.find('input')
				.clear()
				.type('TestRedirect')

			cy.get('label').contains(/Star/i).click()

			cy.get('button[type="submit"]')
				.contains(/Create Profile/i)
				.click()

			cy.url().should('include', '/request-access')
			cy.contains(/Request Access to QNFLMTY/i)
		})
	})

	describe('Can select a profile from the profile selector', () => {
		it('Should see the request access page', () => {
			cy.visit('/select-profile')

			cy.contains(/QNFLMTY/i).should('be.visible')
			cy.contains(/Your Premium NFL Experience/i).should('be.visible')
			cy.contains(/Who's playing\?/i).should('be.visible')
			cy.contains(/Select your profile to continue/i).should('be.visible')

			// Should see the created profile
			cy.contains(firstUsername).should('be.visible')
			cy.contains(/Add Profile/i).should('be.visible')

			// Select the profile
			cy.get('h3').contains(firstUsername).click()

			// Should redirect to request access page
			cy.url().should('include', '/request-access')
			cy.contains(/Request Access to QNFLMTY/i)
			cy.contains(/Request Already Submitted/i).should('be.visible')
		})
	})

	describe('Can edit a profile', () => {
		it('Should update avatar from profile selection screen', () => {
			cy.visit('/select-profile')

			// Find the profile card and hover to reveal edit button
			cy.get('h3')
				.contains(firstUsername)
				.parent()
				.parent()
				.trigger('mouseover')

			// Click edit button
			cy.get('button')
				.contains(/Edit avatar/i)
				.click({ force: true })

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
			cy.contains(/Request Already Submitted/i)
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
			cy.get('button')
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
