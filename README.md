# WELCOME TO REMNANT
### Made by: Pedro Blanco & Stanley Eng
### Built with: ElevenLabs, Better-Auth, Next.JS, Prisma, Neon, React, TypeScript, Tailwind

# Inspiration
The inspiration behind this project was the recent push that has been going on in the film industry, where many companies and/or studios are using generative AI tools, such as voice cloning, to be more efficient. This led us to wonder why it couldn't be used for something more sentimental, such as memories of our families. Studies have shown that hearing our families voices in moments of distress or anxiety helps people calm down, but not everyone has a voice recording of their loved one. Our solution to this is Remnant, a web app that allows users to upload their voice and have seamless access to personalized voice recordings of their family.

# What it does
Remnant allows user to sign up, create, and join a family. Through the sign-up process, we ask them to record an audio of themselves speaking on our app. We then send this to the ElevenLabs Voice Cloning API for voice cloning. This returns a voiceId through the API that we store and use to create an audio file for all the messages that the user can send to their family and store it in our database. In the family dashboard, users are able to see all their "memories" (voice recordings) that family members have sent to them and listen in their respective voices. Users are able to send pre-set messages, such as wishing their family member happy birthday or simple words of gratitude or choose to send their own custom message. Some good use cases for our web app are for elders in the family to pass on knowledge, such as stories, family traditions, and even recipes. The reason this app is used instead of memos, is for efficiency, and customizability; sometimes, its hard to always get a video or audio recording right, and a lot of time goes into script writing, planning, and editing. However, with Remnant, families can have real, emotional memories of their past, saved to be heard in the future by simply recording their voices.

# How we built it
We built this app using React, TypeScript, and Tailwind as the frontend on Next.JS. The app was built around the ElevenLabs API voice cloning feature and we used Vercel for deployment, as well as Neon to host our Prisma database. To capture the user's audio, we used a MediaRecorder API to record user's voices and BetterAuth for seamless account authentication.

# Challenges we ran into
Some of the main challenges we ran into were around our main feature: voice cloning. We needed to be able to record a user's voice, and then send this audio recording to the API from ElevenLabs so we can recieve a voiceId. We got around this by using the MediaRecorder API to get the audio recording that we can then send to ElevenLabs for cloning. The next issue was then storing the text made audio files from ElevenLabs so other members of the family can hear them. The plan was to store it as a blob, but to get a working product, we just left it as the actual audio base64 URL.

# Accomplishments that we're proud of
We are proud of the fact that we made this idea into a reality through the form of a web app. However, we need to do more work to get the app at a proper point for real-world use. We still managed to get our main features working, which was a huge accomplishment and motivation booster. Despite the fact that we worked with a lot of unfamiliar technologies, there was a lot to learn and test through trial and error, and it was a fun experience overall.

# What we learned
We learned a lot about the capabilities of ElevenLabs. We mostly focused on the voice cloning feature, but were very impressed with the quality and how quickly the API returns voice-generated content. Unfortunately, we were unable to experiment with the rest of ElevenLabs outside of voice cloning and audio generation, but would like to learn more and see what other projects could be built with it.

# What's next for Remnant
The main thing that we would want to really hammer down is the styling of the site to make it seem more "family-friendly". We would also want to replace our current voice cloning with the more high-end version on ElevenLabs for users that want to provide longer audio responses to have more accurate voice clones. Currently, we only use their quick cloning feature, which lacks some of the quality of the other option. Due to this, we would do a big revamp, to make our front end more inviting for families, and have our backend support bigger files, larger families, and more collections of memories.

# Try it yourself:
- First, clone the repository
- Then run ``npm install``
- Finally run ``npm run dev``
- Access the web app on ``http://localhost:3000``
