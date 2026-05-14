To run start

npm start

So for the keys in my project I put them in .env file such that when I store them in github it wont be seen
by other people.


How the APi function is when
User reach the log in endpoint we create a new object



So my API flows this way

1. User logs in with WorkOS, and server stores a secure session cookie
2. Frontend then asks "Who is logged in?" and the server answers with the current user.
3. Frontend sends inboarding answers to the server and MongoDB stores them in the user profile.
4. The frontend creates, reads, updates and deletes transactions tied to the logged-in user's WorkOS ID


Login / Signup
      ▼
Backend/server
server.js
      ▼
    WorkOS
      ▼
Server sets cookie
      ▼
redirect to dashboard or onboarding
      ▼
    Who am I?
      ▼
  /api/auth/me
      ▼
server reads cookie
      ▼
  WorkOS validates session
      ▼
  return user.id

---------------------------------------
Onboarding complete
       ▼
    /api/profile/onboarding-complete
       ▼
    server authenticates user
       ▼
    MongoDB UserProfile

--------------------------------------
Transactions:
 GET /api/transactions
 POST /api/transactions
 PUT /api/transactions/:id
 DELETE /api/transactions/:id
       ▼
  server authenticates user
       ▼
  MongoDB Transaction docs
       ▼
  Filtered by workosUserId = user.id
