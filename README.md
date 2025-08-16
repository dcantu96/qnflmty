# Qnflmty

## Todo

- [x] Make it deploy (vercel)
- [x] Scaffold basic ui with mock data
- [x] Setup db (vercel postgres)
- [x] Attach db to ui
- [x] Add authentication (w/ next-auth)
- [x] Attach end to end tests (cypress)
- [x] Attach CI for cypress cloud
- [ ] UI for brand new users
  - Layout: No sidebar, full page view
    - welcome message
    - what's next section
    - Group Info section
- [ ] UI for users with existing usernames
  - One username selected at a time, it can be authorized or not
  - If not authorized
    - Layout: No sidebar, full page view
      - show request access section
      - welcome message
      - selected username
      - request access section
      - what's next section
      - Group Info section
  - If authorized
    - Layout: Page with Sidebar
      - dashboard home view
- [ ] Error management (w/ sentry)
- [ ] Routing (parallel route)
- [ ] Delete button (w/server actions)
- [ ] Analytics (posthog)
- [ ] Ratelimiting (upstash)
