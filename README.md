# Social Feed

## Architecture Explanation

The Social Feed (D'Social) project is built using **React + TypeScript**, leveraging the **React-Bootstrap** library for UI components. The architecture follows a component-based structure, where each component is responsible for a specific part of the user interface. 

### Pages

The project deals with mainly 2 page components.
1. LoginPage: Responsible to allow user to get login. `src/context/Auth/userData.ts` holds a static user to test the project. **To test how the app behaves if login as a Moderator and how if not just tweak the `isModerator` flag.** 

2. FeedPage: The main container page where most of the operations are being handled. FeedPage contains different components fulfilling code reusing and structurization.


The application uses a context-based approach for state management, utilizing custom hooks (`useCache` and `useAuth`) to manage caching and authentication, respectively.

## Key Trade-offs

1. **Show list of posts with infinite scroll.**
2. **Search posts by title (debounced).**
3. **When post clicked, load comments lazy loaded.**
4. **Add, Edit and Delete Posts.**
5. **Add Comments.**
6. **Only Moderator can Approve/Reject comment.**
7. **Store approved comments count locally.**

## How Caching is Designed

Caching is implemented through a custom context `useCache` that stores comments and posts in browser's localStorage memory. The cache is structured to hold comments associated with each post, allowing for quick retrieval without repeated API calls. The caching mechanism includes:

- **Fetching Comments**: When comments are fetched, they are stored in the cache for future access.
- **Updating Comments**: New comments submitted by users are added to the cache immediately, providing instant feedback without waiting for a server response.
- **Moderation**: The cache can be invalidated or updated based on specific actions, such as when a comment is moderated.

## Improvements if More Time

1. **Enhanced Features**: Developing a more robust moderation interface with features like comment updation and deletion, replying a comment, and user reporting could improve the moderation experience.

2. **Real-time Comment Updates**: Implementing WebSocket support to allow real-time updates for new comments and moderation actions would enhance user engagement.

## Get Started

To get started with the project, follow these steps:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. To test moderator functionality:
  - Open `src/context/Auth/userData.ts`
  - Set `isModerator: true` in the user object
  - Login with the test user credentials

The application will be available at `http://localhost:5173`

