An implement of this article [Play YouTube Videos Through Lightning Web Components](https://developer.salesforce.com/blogs/2019/07/play-youtube-videos-through-lightning-web-components.html)

## Demo

[Lightning Embed Video Demo page](https://otdev-developer-edition.ap15.force.com/s/lightning-embed-video)

## Installation Instructions

There are two ways to install Lightning Web Components Embed Video:

-   [Using a Scratch Org](#installing-embed-video-to-your-org): This is the recommended installation option. Use this option if you are a developer who wants to experience the app and the code.
-   [Using an Unmanaged Package](#installing-embed-video-using-an-unmanaged-package): This option allows anybody to experience the sample app without installing a local development environment.

## Installing Embed Video to your Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

-   Install Salesforce CLI
-   Install Visual Studio Code
-   Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

2. If you haven't already done so, authenticate with your org

```
sfdx force:auth:web:login
```

3. Clone the repository:

```
git clone https://github.com/hanabiiii/lightning-embed-video.git
cd lightning-embed-video
```

4. Deploy the app to your org:

```
sfdx force:source:deploy -x manifest/package -u [your-account]
```

5. Assign the **Embed Video** permission set to your account:

```
sfdx force:user:permset:assign -n Embed_Video -u [your-account]
```

6. Go to your org, in App Launcher, select the **Embed Video** app.


7. Provide your Youtube Data API key to retrieve Youtube playlist info. For more information, please go to [this link](https://developers.google.com/youtube/v3/getting-started).

## Installing Embed Video using an Unmanaged Package

1. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t2v000006dGSt) to install the Embed Video unmanaged package in your org.

2. Select **Install for All Users**

3. In App Launcher, select the **Embed Video** app.
