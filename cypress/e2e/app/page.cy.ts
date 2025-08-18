/**
 * Complete User Journey Tests
 * Sequential tests that build upon each other to test the complete user flow
 */
describe('Complete User Journey', () => {
	const testUser = {
		name: 'Journey Test User',
		email: 'journey-test@example.com',
	}
	const firstUsername = 'JourneyTester'
	const secondUsername = 'SecondProfile'

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

	it('1. should redirect new users to profile creation', () => {
		cy.visit('/')
		cy.url().should('include', '/create-profile')
		cy.contains(/Create Your Profile/i)
		cy.contains(/Choose a username and avatar to get started with Qnflmty/i)
	})

	it('2. should display all avatar options on profile creation', () => {
		cy.visit('/create-profile')

		cy.contains(/Choose your avatar/i).should('be.visible')

		cy.get('label').contains(/User/i).should('be.visible')
		cy.get('label').contains(/Crown/i).should('be.visible')
		cy.get('label')
			.contains(/Rocket/i)
			.should('be.visible')
		cy.get('label').contains(/Star/i).should('be.visible')
		cy.get('label').contains(/Heart/i).should('be.visible')
		cy.get('label')
			.contains(/Shield/i)
			.should('be.visible')
		cy.get('label')
			.contains(/Gamepad/i)
			.should('be.visible')
	})

	it('3. should show validation errors for invalid profile input', () => {
		cy.visit('/create-profile')

		// Try to submit without username - button should be visually disabled
		cy.get('button[type="submit"]')
			.contains(/Create Profile/i)
			.should('have.css', 'pointer-events', 'none')
			.should('have.css', 'opacity', '0.5')

		// Try with invalid characters
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

		// Try with username too long
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

	it('4. should create first profile successfully', () => {
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

		cy.contains(/Request Access to QNFLMTY/i)
		cy.contains(firstUsername)
	})

	it('5. should display profile selection screen with created profile', () => {
		cy.visit('/select-profile')

		cy.contains(/QNFLMTY/i).should('be.visible')
		cy.contains(/Your Premium NFL Experience/i).should('be.visible')

		cy.contains(/Who's playing\?/i).should('be.visible')
		cy.contains(/Select your profile to continue/i).should('be.visible')

		cy.contains(firstUsername).should('be.visible')

		cy.contains(/Add Profile/i).should('be.visible')

		cy.get('img[alt="QNFLMTY Logo"]').should('be.visible')
	})

	it('6. should be able to request access', () => {
		cy.visit('/select-profile')

		cy.get('h3').contains(firstUsername).click()

		cy.url().should('include', '/request-access')
		cy.contains(/Request Access to QNFLMTY/i)

		cy.get('button')
			.contains(/Request Access/i)
			.click()

		cy.contains(/Request Already Submitted/i).should('be.visible')
	})

	it('7. should redirect to request access from root when profile is selected and request has not been approved', () => {
		// First ensure profile is selected by visiting select-profile and clicking
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername).click()

		cy.url().should('include', '/request-access')
		cy.contains(/Request Already Submitted/i)
	})

	it.skip('8. should update avatar from sidebar profile switcher', () => {
		// Ensure we're on dashboard with profile selected
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername).click()
		cy.visit('/dashboard')

		// Click on profile switcher dropdown
		cy.get('button').contains(firstUsername).click()

		// Click "Edit avatar" option from dropdown
		cy.contains(/Edit avatar/i).click()

		// Modal should open
		cy.contains(/Update Avatar/i).should('be.visible')

		// Select heart avatar
		cy.get('button').contains(/Heart/i).click()

		// Update avatar
		cy.get('button')
			.contains(/Update Avatar/i)
			.click()

		// Verify update (modal closes)
		cy.contains(/Update Avatar/i).should('not.exist')
	})

	it.skip('9. should update avatar from profile selection screen', () => {
		cy.visit('/select-profile')

		// Find the profile card and hover to reveal edit button
		cy.get('h3').contains(firstUsername).parent().parent().trigger('mouseover')

		// Click edit button (button with Edit icon, screen reader text "Edit avatar")
		cy.get('button')
			.contains(/Edit avatar/i)
			.click({ force: true })

		// Avatar update modal should open
		cy.contains(/Update Avatar/i).should('be.visible')
		cy.contains(`Choose a new avatar for ${firstUsername}`).should('be.visible')

		// Select a different avatar (Star)
		cy.get('button').contains(/Star/i).click()

		// Save changes
		cy.get('button')
			.contains(/Update Avatar/i)
			.click()

		// Modal should close
		cy.contains(/Update Avatar/i).should('not.exist')
	})

	it.skip('10. should allow creating additional profiles', () => {
		cy.visit('/select-profile')

		// Click "Add Profile" button
		cy.get('h3')
			.contains(/Add Profile/i)
			.click()

		// Should be redirected to create-profile
		cy.url().should('include', '/create-profile')
		cy.contains(/Create New Profile/i)
		cy.contains(/Add another profile to your account/i)

		// Create second profile
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

		// Verify the newly created profile username appears in the profile display
		// Look for the h2 element that follows the "Profile Created" text
		cy.contains(/Profile Created/i)
			.parent()
			.find('h2')
			.should('contain.text', secondUsername)

		cy.contains(/Access Request Submitted!/i)
		cy.contains(secondUsername)
	})

	it.skip('11. should show multiple profiles in selection screen', () => {
		cy.visit('/select-profile')

		// Should see both profiles
		cy.contains(firstUsername).should('be.visible')
		cy.contains(secondUsername).should('be.visible')

		// Should still see "Add Profile" option
		cy.contains(/Add Profile/i).should('be.visible')
	})

	it.skip('12. should switch between profiles in sidebar dropdown', () => {
		// First select a profile
		cy.visit('/select-profile')
		cy.get('h3').contains(firstUsername).click()
		cy.visit('/dashboard')

		// Open profile switcher
		cy.get('button')
			.contains(/QNFLMTY Profile/i)
			.click()

		// Should see profiles dropdown
		cy.contains(/Profiles/i).should('be.visible')

		// Should see both profiles in dropdown
		cy.contains(firstUsername).should('be.visible')
		cy.contains(secondUsername).should('be.visible')

		// Should see "Add profile" option
		cy.contains(/Add profile/i).should('be.visible')
	})

	it.skip('13. should redirect to profile selection when no profile selected', () => {
		// Clear localStorage to simulate no selected profile
		cy.window().then((win) => {
			win.localStorage.removeItem('selectedProfile')
		})

		cy.visit('/')

		// Should be redirected to profile selection since profiles exist but none selected
		cy.url().should('include', '/select-profile')
	})
})
