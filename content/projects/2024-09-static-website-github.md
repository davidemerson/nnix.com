+++
title = "nnix.com"
slug = "nnix"
date = 2026-04-07
description = "a cheap way to host a simple static blog."
[extra]
  toc = true
+++

# overview
I migrated from Gemini in September 2024, and not everything came along for the ride, so this is a bit of a reset. I like Gemini a lot, but maintaining a content bridge to the web was a pain, and the audience with native Gemini clients is tiny, so interoperability with others is poor.

The web isn't such a bad place if you have discretion.

This site is a collection of plaintext markdown files stored in git (I use GitHub for this at writing). When I push a change to the main branch of the repository hosting these files, a GitHub action kicks off and compiles the markdown files into html using [Zola](https://www.getzola.org/), a static site generator. There's also a separate action that validates the build on pull requests, so I can catch breakage before it hits production.

You don't need wordpress for a few pages. Heck, you don't need wordpress for even a hundred pages. I'm not saying it's a bad idea, just that it's convoluted to design, maybe more expensive, and definitely harder to administer than this kind of setup, which can be run in an S3 bucket from a github repository.

The entire site, without graphics, is under 80 kb. I will not permit it to exceed 128 kb, but this is a personal constraint. It's not Gemini-small, but it's in the spirit of [one of my favorite sites on the web](https://perfectmotherfuckingwebsite.com/).

If you want something similar, follow this doc. I'm sure I will too when I want to remember what I did with this thing years from now.

# assumptions
* You have a domain, foo.com or the like (idk $10/year?)
* You have an AWS Account (free)
* You have a GitHub Account (free)
* You know some stuff about DNS and can poke your way around the AWS Console.

# AWS S3
You have an S3 bucket, `foo.com`, in `us-east-1`. It has ARN `arn:aws:s3:::foo.com` and static website hosting is turned on. The static website origin is at:
```
http://foo.com.s3-website-us-east-1.amazonaws.com/
```

I have a bucket policy which defaults to public access:
```
{
  "Id": "Policy1726679145347",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1726679140826",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::foo.com/*",
      "Principal": "*"
    }
  ]
}
```

Remember to change the "Resource" line to your actual ARN, which is probably not truly foo.com.

## AWS CloudFront
There's a cloudfront distribution at: 
```
https://d3mip7fsd83s7mvq5.cloudfront.
```
with ARN:
```
arn:aws:cloudfront::8986388484237:distribution/E4DE38M2FUA4N
```
It points to the foo.com bucket origin above and has a foo.com CNAME attached to it with a custom certificate.

# foo.com Certificate
CloudFront needs a cert, so we have AWS ACM issue one for foo.com. ECDSA P-256 certs now work with CloudFront, but RSA 2048 is still the safe default if you don't want to think about it.

# foo.com A record
We use the A record alias feature in Route53 to point to the CloudFront distribution for foo.com. This only works once the custom CNAME and certificate are in place, of course.

# AWS Bucket Policy Setup
We created a new policy by logging on to AWS Console and going to IAM > Policies > Create policy. Switch from the visual editor to JSON and paste the following snippet. Remember to update your bucket ARN names under "Resource":

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccessToWebsiteBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:PutBucketWebsite",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::foo.com",
        "arn:aws:s3:::foo.com/*"
      ]
    },
    {
      "Sid": "AccessToCloudfront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:GetInvalidation",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

Once the policy is created you need to create a new user under IAM > Users. Give it a name such as foo-com-github-user. On the "Set Permissions" step select "Attach Policies Directly" and find the policy we created in the last step.

From the list of users click on your newly created account and then open the Security Credentials tab. Under Access keys select > Create access key and choose Command Line Interface (CLI). Click "I understand the above recommendation" and then Create access key. Note the Access Key ID and Secret Access Key.

# GitHub Setup
Next we need to create the Github Actions workflows. We need workflow files in the .github/workflows directory of our repository. This can be done by navigating to the Actions tab in GitHub or by committing the files from your machine.

First, store your AWS credentials and CloudFront distribution ID as GitHub secrets. Go to your repo's Settings > Secrets and variables > Actions, and add:
* `AWS_ACCESS_KEY_ID` — the access key you recorded earlier
* `AWS_SECRET_ACCESS_KEY` — the corresponding secret key
* `CLOUDFRONT_DISTRIBUTION_ID` — the ID of your CloudFront distribution (e.g. `E4DE38M2FUA4N`)

## deploy workflow

.github/workflows/publish.yaml handles building and deploying on push to main:
```
name: Build and Publish to AWS

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install Zola
        uses: taiki-e/install-action@v2
        with:
          tool: zola@0.22.1

      - name: Build Zola Site
        run: zola build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          # HTML/XML/JSON: short cache, revalidate often
          aws s3 sync public/ s3://foo.com \
            --delete \
            --cache-control "max-age=300, must-revalidate" \
            --exclude "*" \
            --include "*.html" \
            --include "*.xml" \
            --include "*.json"

          # Static assets: long cache, immutable
          aws s3 sync public/ s3://foo.com \
            --cache-control "max-age=31536000, immutable" \
            --exclude "*.html" \
            --exclude "*.xml" \
            --exclude "*.json"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

The S3 sync uses two passes with different cache-control headers. HTML and other frequently-changing files get a short 5-minute cache with must-revalidate, while static assets (images, CSS, fonts, JS) get a one-year immutable cache. CloudFront invalidation ensures the CDN picks up new content immediately after deploy.

The `workflow_dispatch` trigger lets you kick off a deploy manually from the GitHub Actions tab, which is handy when you need to redeploy without a code change.

## PR build check

.github/workflows/pr-check.yaml validates the site builds on pull requests:
```
name: PR Build Check

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install Zola
        uses: taiki-e/install-action@v2
        with:
          tool: zola@0.22.1

      - name: Build Zola Site
        run: zola build
```

This is just a build check — no deploy. It catches broken templates or bad markdown before you merge to main.

# Zola init
Clone your GitHub repo to a machine on which you can install Zola. This is easiest on a MacOS or Linux machine, but you can do it in Windows too.

Follow the [Zola install instructions](https://www.getzola.org/documentation/getting-started/installation/) and then navigate to the cloned repo directory on your local machine and execute:
```
zola init
```
... in the root directory of the repo. That gets a basic site framework which the "zola build" command in the above github workflow can work upon.

Commit/push the changes to your repo back up to GitHub, and you should see the action execute in GitHub, hopefully with success - check out https://github.com/youruser/foo.com/actions page for status.

If the action is not successful, just read the logs and see what went wrong.

# adding a template and other basics

I host the template I use on github.com. It's a basic one, but a good place to start so you know how things fit together when working.

## favicon

You need a favicon. I don't get in to the whole static size thing because I'm not fancy enough to care about old browsers, so I recommend simply uploading an svg version of your favicon to `/static/favicon.svg` which transforms to `/favicon.svg` when the site is compiled. You'll need to specify this favicon file in your `/templates/head.html`.

## og:image

If you want your site to render an og:image when it gets posted to the various social sites, you need to upload an og:image of the correct size (1200x630 pixels) and refer to it in `/templates/head.html`. I put mine at `/static/nnix.png` which transforms to `/nnix.png` at compile time, and I refer to it in `/templates/head.html` which places it on the head for all my various pages.

## icons

There are innumerable icons you can add for various purposes, such as mobile device icons and preview pages. Don't overthink this, your website doesn't need very many of these unless you're hosting a webapp, which we aren't. Check out the ones I have in `/static/` and steal from there as you see fit. Examples include:

* Android 192x192 icon
* Apple Touch icon
* MS Tile 150x150 icon
* Safari Pinned Tab icon

## bimi

There's a BIMI icon in my template for this site, but that's an email thing. It makes your emails look branded from you. It's really not interesting for most people, I'd just forget about it. I did this because I can, not because I needed to.

# writing projects
I mainly use my website as a project listing. It's got one main directory for the "bloglike" stuff, which is basically a page per project which generates a table of contents for the project directory page. This main directory is `/content/projects/`. Images are stored in `/static/images` which, when rendered, becomes `/images`.

Otherwise, there's a main page located at `/_index.md` which renders to `/index.html`, and it's just a landing page for my site.

# note
* Use GitHub secrets for all credentials and distribution IDs. The workflow examples above reference secrets, so nothing sensitive is committed to the repo. This means your repo can be public without leaking keys.