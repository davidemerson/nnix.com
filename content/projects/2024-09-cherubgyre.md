+++
title = "cherubgyre"
slug = "cherubgyre"
date = 2024-11-11
description = "anonymous community defense social network."
[extra]
  toc = true
+++

# status
My goal is to have a working alpha inside six months, the time it took [Andy Goldsworthy](https://www.glenstone.org/artist/andy-goldsworthy/) to complete “Boulder”, allegedly. I do not know if this is a long time or a short time, but there are professionals with strong opinions on the matter.† This seems like a small stone hut of a project with a clay sphere inside, so I'm going with six months to alpha.

<body>
    <div class="timeline">
        <div class="timeline-item">
            <div class="date">20 September 2024</div>
            <div class="event">The project started in earnest</div>
        </div>
        <div class="timeline-item">
            <div class="date">11 November 2024</div>
            <div class="event">Server deployment documentation (ECR/ECS/Fargate) created. Test suite started in Postman.</div>
        </div>
        <div class="timeline-item">
            <div class="date">28 October 2024</div>
            <div class="event">API documentation updated</div>
        </div>
        <div class="timeline-item">
            <div class="date">14 October 2024</div>
            <div class="event">
            * API development started
            * App wireframes at about 85%, on Penpot
            * Server development started
            * Deployment documents started (AWS Lambda / API Gateway)
            * Database development started
            * Rust code started merging into [repository](https://github.com/davidemerson/cherubgyre/)
            * CI pipeline and tests built
            * Put up a [security.txt](https://cherubgyre.com/.well-known/security.txt) and a [public pgp key for security@cherubgyre.com](https://cherubgyre.com/.well-known/pgp-key.txt) just in case
            * Moved a couple open items to Issues, we'll use those more now that the repo is running a bit
            </div>
        </div>
        <div class="timeline-item">
            <div class="date">12 January 2025</div>
            <div class="event">Optimized the Rust build process, becuase it's taking like 1600 seconds to make a build, and that's nutty. Got it down to 687 seconds, but I'm not totally impressed yet. Getting annoyed.</div>
        </div>
    </div>
</body>

† - I know at least one.

# overview
This is a repository of design notes for an application I'm building, slowly and in spare time.

cherubgyre is an anonymous community defense social network. This app allows individuals to disclose details of their location and state of duress while remaining anonymous.

{{ img(id="/images/IMG_2055.jpeg", alt="A Gyre of Cherubim etc.") }}
a gyre of cherub(im) and friends. Detail from the [original Doré](/images/empyrean.jpeg)

# audience
There are some folks who obviously need this, and others who simply might appreciate having it available. The service is not intended to be intrusive or noisy, it's intended to mostly sit idle until needed, providing a reasonable level of feedback to your community regarding your state of duress.

If you're still having trouble imagining who needs this, I guess here's some ideas:
* journalists
* dissidents
* high-profile individuals and their families
* anyone who does dangerous things now and then
* anyone who cares about someone who does dangerous things now and then

There are many reasons you might prefer this solution to others, such as:
* it's open source, which means you can inspect the code to ensure it is not collecting or transmitting anything to which you object
* it's independent of any walled garden, which means your Android friends can play with your Apple friends
* you can run this server on your own, if you have a community especially sensitive to using a shared service
* you aren't obligated to transmit identifying details without consent, as you might with some of the major vendor solutions, which are not intended to be anonymous ("Find My Friends")
* you want to share your location under duress, but not necessarily in a social context

This app is not intended to supersede or replace emergency services. Emergency services often lack the context a familiar community might possess, so the engagement of both emergency services and a familiar community may be appropriate.

If your friends receive a duress call from you, and they possess the context (communicated through other channels in advance) that you had set a timer before going out on a date with someone heretofore unknown to you, your friends can choose to engage emergency services on your behalf, as they deem appropriate, or as agreed upon between you in advance.

There are also individuals and communities which cannot engage, or would prefer to avoid engaging, emergency services for legal or social reasons. If you are a dissident in an unfriendly political environment, for example, notifying local authorities when you experience duress may be suboptimal for you. This service may provide a social alternative, though it is not presented as a functional alternative, for obvious reasons.

# api
The API is documented using Swagger in OpenAPI 3.0.3 format, [hosted at this url](https://api.cherubgyre.com).

# server
The server code will be [hosted at this url](https://github.com/davidemerson/cherubgyre), but work is focused on the API at the moment.

The server will be written in Rust. It’s not the optimal language ergonomically for implementing an API, but it’s reasonably accessible and [extremely resource efficient](https://greenlab.di.uminho.pt/wp-content/uploads/2017/10/sleFinal.pdf). Writing in Rust for an application intended to scale is an environmentally and architecturally sound decision.

# website
There's a rudimentary placeholder website [here for now](https://cherubgyre.com).

# features
{{ img(id="/images/cg/splash.png", alt="a splash screen") }}
{{ img(id="/images/cg/mainpage_active_notification.png", alt="the mainpage with an active duress notification") }}
## registration
### invitation
Registration is by invite from an existing community member only. The inviter gets a token which they communicate to the invitee. If a user is deregistered for some reason, they will need to be reinvited. A single user can only request five invite codes per 168 hour period.
{{ img(id="/images/cg/invite_user.png", alt="inviting a user") }}
### acceptance & registration
Invitee enters the token given to them by their inviter.
{{ img(id="/images/cg/invite_valid.png", alt="entering a valid invite code") }}
They then elect a duress pin code as well as a normal pin code.
{{ img(id="/images/cg/register_pin.png", alt="entering a valid pin code") }}
{{ img(id="/images/cg/register_duress.png", alt="entering a valid duress code") }}
The invitee receives a username and a procedurally generated avatar in response.
{{ img(id="/images/cg/welcome.png", alt="when you get your anon identity") }}


## users
### UIDs
UIDs will be assigned at registration, and are [UUIDv7](https://www.uuidgenerator.net/version7) format. Example:
```
0192246c-a257-787d-83ba-2b0c007e0941
```
### usernames (friendly names)
Community members are identified by a randomly chosen unique name, consisting of a type of angel, a type of curl or vortex, and city name. For example,
```
"cherub-gyre-chicago"
```
might be an anonymous community member name. Friendly names can be reused if they are not presently in use but have previously been in use.
### avatars
Community members are identified by a procedurally generated avatar assigned at registration. We'll use an [identicon](https://github.com/yzalis/Identicon), but which only generates monochrome output. [Here's](https://sweary.com/identicon-generator/) an interactive example (set pixels to black).
### identifying information
No identifying information is collected or stored by the system. This is intentional.


## subscription
{{ img(id="/images/cg/befriend.png", alt="when you're befriending someone, or managing your friends and followers") }}
### following (befriend)
Users can follow each other by friendly name or by UID, either one. When a user attempts to to follow another user, the followed user will need to authorize the follower.
### unfollowing
You can see who is following your status, and can remove them from following you, optionally banning them from refollowing you.

## duress
### duress pin code
When launched, the app asks for an unlock code. The entry of the preconfigured duress code will plausibly unlock the app, but will reveal randomly generated settings and associations, to ensure that no identifying information is disclosed. Additionally, the entry of the preconfigured duress code will notify the network that your duress code was entered ("duress unlock").
{{ img(id="/images/cg/duress_unlock.png", alt="the button turns red when you have entered a duress  unlock") }}
### wrench attack
{{ img(id="https://imgs.xkcd.com/comics/security.png", alt="the wrench attack") }}
The path at the bottom of the screen is red in duress mode, but all content is randomly generated, such that it discloses no information about the status or friend network of the user in duress, but looks plausibly unlocked while sending a duress status. This helps with the [wrench attack](https://xkcd.com/538).
{{ img(id="/images/cg/duress_status.png", alt="here's what your duress-unlocked status page will look like") }}
{{ img(id="/images/cg/duress_befriend.png", alt="likewise, your duress-unlocked befriend page, which has a red path and randomly generated friends and statuses") }}

### accelerometer duress
If a phone is thrown, dropped, or experiences a large shock, the user will receive a notification from the app that they have one minute to unlock (using the pin code) the app, or a duress signal will be sent ("g force duress"). Of course, if the app is unlocked with the duress code, the duress signal will be published ("duress unlock")
### timeout duress
The user can start a countdown timer. At the end of the timer, the app will publish a notification and the user will have five minutes confirm that they are ok. If they do not confirm that they are ok before the five minutes lapses, a duress signal will be published ("missed check-in")
{{ img(id="/images/cg/timer_unset.png", alt="what it looks like when you're setting a timer") }}
{{ img(id="/images/cg/timer_progress.png", alt="what it looks like when a timer is in progress") }}
{{ img(id="/images/cg/duress_timeout.png", alt="what it looks like when someone is in a timeout duress state") }}
### rate limit
You can't have a duress alert sent more than once per hour.
### location based duress broadcast
Users may elect (default off) to have their duress status broadcast to nearby users (within 500 m) regardless of whether they are following each other. Users may opt in or out of receiving such broadcasts.
### duress cancellation
An active duress status may be canceled by a user who enters their normal pin code and confirms cancellation of the duress status. If an active duress status is canceled this way, a notification is sent to their followers that their duress status was canceled.
### test signal mode
The app allows users to enter a testing mode, in which they can check the duress, accelerometer, and other features without sending actual duress signals to the community. Instead, the app will notify the user when it would have sent a duress notification. Testing mode, when enabled, is active for five minutes, and then turns off automatically.

## deregistration
{{ img(id="/images/cg/duress_left.png", alt="what it looks like when someone leaves") }}
### launch lock
If a user enters an incorrect pin code ten times, they are deregistered from the app, and their data is deleted. Friends will receive a message that they “left” which will appear similar to a duress message.
### expiration
Users must check in at least once a year. Failure to check in for a year will result in automatic deregistration due to inactivity. Friends will receive a message that they “left” which will appear similar to a duress message.
### admin
Administrators or systems may manually deregister users, deleting their data.

## map
For any account in duress state, users who follow that account can display a map showing check-in locations since entering duress status.

## configuration
A number of configuration options are contemplated, such as the ability to turn off accelerometer duress, since that's not always helpful for folks who do things that involve shock regularly... like ride a bicycle with their phone in a basket.
{{ img(id="/images/cg/config.png", alt="some config ideas on a page") }}

# license
The server and the API are released under [GNU General Public License 3.0](https://www.gnu.org/licenses/gpl-3.0.html#license-text). This is intended to ensure that the service can be freely modified and economically provisioned by others. I'm not trying to make money on this, the intent is to support anonymous community safety.