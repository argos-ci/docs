---
description: Configure SAML single sign-on with providers like Okta or Auth0 to authenticate your Argos team members.
---

# SAML single sign-on

{% hint style="info" %}
SAML SSO is a paid add-on ($200 / month) available to teams on a Stripe-based subscription. It is included in the [Enterprise](../billing-and-subscription/pricing-plans.md#enterprise-plan) plan.

Only team members with the [owner role](team-members-and-roles.md#owner-role) can configure SAML SSO.
{% endhint %}

To manage your [team members](team-members-and-roles.md) through a third-party identity provider like [Okta](https://www.okta.com/) or [Auth0](https://auth0.com/), configure Security Assertion Markup Language (SAML) from **Team Settings -> Security and Privacy**.

Once enabled, team members can authenticate with your configured identity provider, and new users signing in with SAML will be added to your team.

![The SAML SSO settings for a Team.](<../../.gitbook/assets/saml settings 4a875c027de3b7cc49da61c3b7cbfcbd.png>)

### Enabling the add-on

Unless your plan includes SAML SSO, enable it as an add-on first:

{% stepper %}
{% step %}
Go to your team settings and open the **Billing** tab.
{% endstep %}

{% step %}
In the **Add-ons** section, select **Enable** next to **SAML Single Sign-On**.
{% endstep %}

{% step %}
Select **Confirm and Pay**. The feature is activated immediately.
{% endstep %}
{% endstepper %}

The add-on appears as a "SAML SSO" line on your monthly invoice. You can disable it at any time from the **Add-ons** section; team members will then no longer be able to sign in with SAML.

### Configuring SAML SSO

1. Ensure you are an [owner](team-members-and-roles.md#owner-role) of the team.
2. From the dashboard, select the team in the scope selector.
3. Open the **Settings** tab, then go to **Security and Privacy**.
4. In **SAML Single Sign-On**, click **Configure** and follow the setup flow for your identity provider.
5. Optionally enforce SAML SSO for all team members after confirming authentication works.

### Enforcing SAML

For additional security, you can enforce SAML so team members can only access team resources when their current session is authenticated with SAML.

1. Ensure you are an [owner](team-members-and-roles.md#owner-role) and currently authenticated with SAML.
2. Go to **Team Settings -> Security and Privacy -> SAML Single Sign-On**.
3. Enable **Require team members to log in with SAML**.

![SAML SSO configured and enforced.](<../../.gitbook/assets/saml enforced 0b9acb80b05d917ee70c452b00b6a254.png>)

When you modify your SAML configuration, enforcement is automatically disabled. Re-authenticate with SAML and verify the new configuration before re-enabling enforcement.

### Authenticating with SAML SSO

After SAML is configured, team members can sign in using SAML SSO:

1. On the login page, click **Continue with SAML SSO** and enter your team slug.
2. Click **Continue with SAML SSO** again to be redirected to your identity provider.
3. Complete authentication to access Argos.

#### Customizing the login page

You can share an Argos login URL that only displays the SAML SSO option for a specific team.

```
https://app.argos-ci.com/login?saml=team_slug
```

Replace `team_slug` with your team identifier in Argos URLs.

![Argos's login page showing only the SAML SSO login button.](<../../.gitbook/assets/saml login 9c431d652c0bef06bc59ca1366e15142.png>)

### Managing team members

With SAML SSO, users authenticate through your identity provider, but team membership can still be managed from Argos team settings.

Members are added to your team when they first sign in with SAML, but you can also pre-provision members from the **Team Settings -> Members** page.

When SAML SSO is enforced, team members must have an active SAML session to access team resources. If a member's SAML session expires, they will be prompted to re-authenticate with SAML to regain access.

### SAML providers

Argos supports the following SAML providers:

- [Okta](https://www.okta.com/)
- [Auth0](https://auth0.com/)
- [Google](https://accounts.google.com/)
- [Microsoft Entra (formerly Azure Active Directory)](https://www.microsoft.com/en-in/security/business/identity-access/microsoft-entra-single-sign-on)
- [Microsoft ADFS](https://docs.microsoft.com/en-us/windows-server/identity/active-directory-federation-services)
- [OneLogin](https://onelogin.com/)
- [Duo](https://duo.com/product/single-sign-on-sso/)
- [JumpCloud](https://jumpcloud.com/)
- [PingFederate](https://www.pingidentity.com/en/platform/capabilities/single-sign-on.html)
- [ADP](https://apps.adp.com/en-US/home)
- [Keycloak](https://www.keycloak.org/)
- [Cyberark](https://www.cyberark.com/products/single-sign-on/)
- [OpenID](https://openid.net/)
- [VMware](https://kb.vmware.com/s/article/2034918)
- [LastPass](https://www.lastpass.com/)
- [miniOrange](https://www.miniorange.com/products/single-sign-on-sso)
- [NetIQ](https://www.microfocus.com/en-us/cyberres/identity-access-management/secure-login)
- [Oracle Cloud](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/enable-single-sign-sso.html)
- [Salesforce](https://help.salesforce.com/s/articleView?id=sf.sso_about.htm&type=5)
- [CAS](https://www.apereo.org/projects/cas)
- [ClassLink](https://www.classlink.com/)
- [Cloudflare](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/dash-sso-apps/)
- [SimpleSAMLphp](https://simplesamlphp.org/)
