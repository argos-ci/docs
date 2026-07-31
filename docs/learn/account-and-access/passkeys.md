---
description: "Add passkeys to your Argos account and sign in with your fingerprint, face, screen lock, or a hardware security key."
---

# Passkeys

A passkey replaces a password with the unlock method you already use on your device — Touch ID, Face ID, Windows Hello, your phone's screen lock, or a hardware security key such as a YubiKey.

Because the key is bound to `argos-ci.com` and never leaves your device or password manager, a passkey cannot be phished, reused on a lookalike site, or leaked in a database breach.

You can register as many passkeys as you like — one per laptop, one on your phone, one on a security key — and sign in with any of them.

{% hint style="info" %}
Passkeys are available to every account, on every plan. They sit alongside your other login methods rather than replacing them: adding a passkey does not disable email, Google, GitHub, GitLab, or SAML sign-in.
{% endhint %}

### Adding a passkey

{% stepper %}
{% step %}

### Open your authentication settings

Select your avatar in the top-right corner of the dashboard, choose **Settings**, then open the **Authentication** section.
{% endstep %}

{% step %}

### Start the registration

In the **Passkeys** row, select **Add**. A **Create Passkey** dialog explains what happens next — select **Continue**.
{% endstep %}

{% step %}

### Confirm on your device

Your browser or password manager takes over and asks you to confirm with your fingerprint, face, screen lock, or security key.

If you use a password manager such as 1Password, Bitwarden, or iCloud Keychain, it may offer to store the passkey for you so it syncs to your other devices.
{% endstep %}

{% step %}

### Done

The passkey appears in the **Passkeys** row, named after wherever it was stored — for example **1Password** or **iCloud Keychain**. Expand the row to see it.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
If the dialog reports that registration "took too long or was canceled", the device prompt was dismissed or timed out. Select **Retry** to start over.
{% endhint %}

### Signing in with a passkey

On the [login page](https://app.argos-ci.com/login), select **Continue with Passkey**.

You are not asked for your email first. Your device lists the Argos accounts it holds a passkey for, you pick one and confirm, and you are signed in.

{% hint style="info" %}
A passkey signs you into an account that already exists — it is a login method, not a way to sign up. [Create your account](account-management.md) first, then add a passkey to it.
{% endhint %}

#### Using a passkey from another device

A passkey stored on your phone can sign you in on a computer that has none. Choose **Continue with Passkey**, then pick the option to use a phone or tablet. Your browser shows a QR code; scan it with your phone and confirm there.

### Managing your passkeys

Expand the **Passkeys** row in **Settings -> Authentication** to see every passkey on your account, when each was created, and when it was last used.

- **Rename** — select the pencil icon and give the passkey a name you will recognise later, such as "Work laptop". The default name reflects where the passkey is stored, which is not always enough to tell two apart.
- **Delete** — select the trash icon and confirm. That device can no longer be used to sign in.

{% hint style="warning" %}
Deleting a passkey only removes it from Argos. Your password manager or device keychain may still hold an entry for `argos-ci.com` that you will want to clean up separately.
{% endhint %}

### Passkeys and SAML SSO

If one of your teams [enforces SAML SSO](saml-single-sign-on.md#enforcing-saml), a passkey signs you into Argos but does not satisfy that requirement. You keep access to your personal account and to teams without enforcement, and Argos prompts you to re-authenticate with SAML when you open a team that enforces it.

### Troubleshooting

<details>

<summary>"Continue with Passkey" is missing from the login page</summary>

Your browser does not support passkeys. Argos hides the option rather than offering something that cannot work. Passkeys need a current version of Chrome, Safari, Edge, or Firefox; update your browser, or sign in with another method.

</details>

<details>

<summary>Nothing happens, or my device says it has no passkey for this site</summary>

The device you are on holds no Argos passkey. Either sign in another way and [add a passkey](passkeys.md#adding-a-passkey) on this device, or use the [QR-code flow](passkeys.md#using-a-passkey-from-another-device) to sign in with a passkey stored on your phone.

Passkeys are also bound to the domain they were created for, so one registered on a self-hosted Argos instance will not work on `app.argos-ci.com`.

</details>

<details>

<summary>"This passkey is already registered"</summary>

That device or password manager already holds a passkey for Argos — possibly on a different Argos account. A passkey belongs to exactly one account. Check the **Passkeys** row on the account you expect it on, or delete the existing entry from your password manager before registering again.

</details>

<details>

<summary>"The passkey request expired"</summary>

Registration and sign-in must be completed within a few minutes of starting. Start again from **Add** or **Continue with Passkey**.

</details>

<details>

<summary>I lost the device holding my only passkey</summary>

Sign in with another method — an email code, or Google, GitHub, GitLab, or SAML — then delete the passkey for the lost device from **Settings -> Authentication** and register a new one. This is why it is worth keeping a second passkey, or at least one other login method, on your account.

</details>
