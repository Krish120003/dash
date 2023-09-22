# Devpost
View the devpost for Dash [here](https://devpost.com/software/dash-um2zil).

# Inspiration
I (Jason) started using Home Assistant about a year or so ago, and always thought it would be useful to have a similar customizable dashboard for the rest of my online life. Since then, Jason has shared this with all of us and as roommates, we all have a huge interest in home automation. Taking inspiration from both hyper-customized HTML start-pages from the early web, and the modern Momentum-like new tab pages of today, we decided to create Dash to make a useful homepage for our browsers.

As busy students and software developers, It's always nice to try and automate complexity out of our daily workflow. Inspired by the dashboard on Home Assistant, we decided to create a general purpose dashboard built to be your central point of your digital life.

# What it does
Dash is a hub meant to contain common web resources that a user frequents. These could be stock information, course schedules, weather, news summaries, or actionable emails. We intend for the dashboard to be user-friendly while being customizable.

Dash operates on data from your Gmail, calendar, and location to build a contextual dashboard for a new tab page. Location is at school? Dash opens smart summaries of your school email. Back home and wanna read up on your stock trading hobby? Dash automatically detects your location, and presents you with the latest stock news summaries and ticker prices.

# How we built it
We used the T3 Stack (NextJS, Typescript, tRPC, Prisma, Tailwind) to make our web application. We utilize Google Cloud for Gmail, Google Calendar, and news api. We also use open weather api to get live news and weather data from your location. Yahoo finance was used to retrieve the latest stock prices.

We developed an entire widget and grid system from scratch in React for this, and we use Cockroach DB to store all our user data, from authentication, to service OAuth tokens, to storing detailed and complex dashboard layouts.

# Challenges we ran into
- Ideation + finishing the project in time
- Deciding what features to prioritize
- Finding a balance between displaying sufficient info and retaining a clean UI
- React state management and mutation with React Query
- Making a fully dynamic grid system to load a large number of widgets
- Implementing several useful widgets for our users.
# Accomplishments that we're proud of
- Widget adding tool
- Working stock display widget
- Storing dynamic layout in the database
# What we learned
- Building a dynamic widget system is difficult. Very difficult.
- Storing metadata for various widgets in a relational database, with various different fields for each type of widget.
- How to use Yahoo finance API (unofficially)
- How to use React Query well
- How hard it is to build a user-configurable dashboard
- By deconstructing the layout state into JSON we were able to store it on a database
# What's next for Dash
Complete compatibility with student portals (Avenue to Learn, etc.) More options for the UI, such as more options for information display, and font customization Increased efficiency for loading widgets Uploading custom themes and background We originally planned for multiple dashboard support, and dynamic context-based switching. Unfortunately, we found that implementing an editable dashboard was more difficult than expected, and we were unable to add that feature in time.

# Cockroach DB
We used Prisma as an Orm with official support for cockroach db to store most of the data from our web app. We stored the typical info such as user accounts from authentication and location data for use in backend and frontend. We decided to try an innovative approach for the first time where we stored our dynamic layout state in cockroach db which means any changes made by the users are synced and stored in the database.

# Google Cloud
Since we’re connecting many services such as gmail, calendar, events, google docs and Oauth we used google cloud APIs to streamline the process of fetching and processing the data.

# Best.tech Domain
We used the domain dashapp.tech for our app which is memorable and short. It’s also very telling of our project, it being a dashboard app to help manage your tech.

GitHub
We used github as our version manager and connected it to our deployment service Vercel. This allowed for fast and convenient CI/CD where our commits were deployed in less than a minute and we could check our changed code in the production environment. We used a vs code share server to collaborate on the code as a group which allowed us to finish many features at the last minute.

